'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
const chartData = [
	{ option: 'Manuel', votes: 3 },
	{ option: 'Bob', votes: 5},
	{ option: 'Micheal', votes: 5 },
	{ option: 'Here', votes: 7 },
	{ option: 'Glory', votes: 4 },
	{ option: 'Save', votes: 1 },
];

const chartConfig = {
	votes: {
		label: 'Stimmen',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig;

export default function Component() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Umfrageergegnisse</CardTitle>
				<CardDescription>Wer ist der Coolste Mann?</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 20,
						}}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="option"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Bar dataKey="votes" fill="var(--color-desktop)" radius={8}>
							<LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
			</CardFooter>
		</Card>
	);
}
