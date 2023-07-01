export function standardDeviation(values: number[]) {
	const avg = average(values);
	const squareDiffs = values.map(function (value) {
		const diff = value - avg;
		const sqrDiff = diff * diff;
		return sqrDiff;
	});

	const avgSquareDiff = average(squareDiffs);
	const stdDev = Math.sqrt(avgSquareDiff);
	return stdDev;
}

function average(data: number[]) {
	const sum = data.reduce((sum, value) => sum + value, 0);
	const avg = sum / data.length;
	return avg;
}
