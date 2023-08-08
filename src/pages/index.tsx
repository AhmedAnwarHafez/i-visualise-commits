import pkg from '@prisma/client'

import MainLayout from '../layouts/main'
import ListCommitsByDay from '../components/ListCommitsByDay.astro'
import ListStudents from '../components/ListStudents.astro'
import PivotCommits from '../components/PivotCommits.astro'
import { getStudentSummary } from '../github'
import * as db from '../../prisma/db'
import { createPivotTable, flip  } from '../utils'

const { PrismaClient } = pkg

interface Props {
  sort: string
}

function Index({ sort}: Props) {
const prisma = new PrismaClient()
const commits = await db.getCommits(prisma)

const students = flip(commits)


const studentSummary = getStudentSummary(students)
if (sort === 'progress') {
  studentSummary.sort((a, b) => b.progressScore - a.progressScore)
} else if (sort === 'name') {
  studentSummary.sort((a, b) => a.name.localeCompare(b.name))
}
else if (sort === 'commits') {
  studentSummary.sort((a, b) => a.totalCommits - b.totalCommits)
}
else if (sort === 'repo') {
  studentSummary.sort((a, b) => a.lastRepo.localeCompare(b.lastRepo))
}
else if (sort === 'date') {
  studentSummary.sort((a, b) => a.lastCommitDate - b.lastCommitDate)
}

let pivotReposStudents = createPivotTable(students, 'repo_name')
let pivotDaysStudents = createPivotTable(students, 'created_on')
const uniqueNames = students.map((student) => student.name)


<MainLayout title={import.meta.env.GITHUB_ORG}>
  <div class="flex flex-col gap-10 w-fit items-center justify-center mx-auto">
   <h2 class="self-start text-lg font-medium text-slate-400">
      A list of all students in the cohort
    </h2>
  
   <ListStudents  studentSummary={studentSummary}  />
  <h2 class="self-start text-lg font-medium text-slate-400">
      Total commits for each student for all challenges
    </h2>
  <PivotCommits studentNames={uniqueNames} pivotTable={pivotReposStudents} />
   <h2 class="self-start text-lg font-medium text-slate-400">
      Total commits for each student for each day
    </h2>
   <ListCommitsByDay studentNames={uniqueNames} pivotTable={pivotDaysStudents} />
  </div>
</MainLayout>
}