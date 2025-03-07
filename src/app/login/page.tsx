import SigninForm from '@/components/signin-form';
import SignupForm from '@/components/signup-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

export default function Login() {
	return (
		<div className="flex flex-col items-center pt-[25vh]">
			<Tabs defaultValue="signin">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="signup" className="px-12">
						Registrieren
					</TabsTrigger>
					<TabsTrigger value="signin" className="px-12">
						Anmelden
					</TabsTrigger>
				</TabsList>
				<Card className="w-full py-6 px-4">
					<TabsContent value="signup">
						<SignupForm />
					</TabsContent>
					<TabsContent value="signin">
						<SigninForm />
					</TabsContent>
				</Card>
			</Tabs>
		</div>
	);
}
