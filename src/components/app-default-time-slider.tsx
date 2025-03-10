import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

type SliderProps = React.ComponentProps<typeof Slider>;

export function DefaultSlider({ className, ...props }: SliderProps) {
	return <Slider defaultValue={[3]} max={7} step={1} className={cn('w-[60%]', className)} {...props} />;
}
