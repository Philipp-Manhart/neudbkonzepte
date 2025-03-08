import SigninForm from '@/components/signin-form';
import SignupForm from '@/components/signup-form';
import AnonymousForm from '@/components/anonymous-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cookies } from 'next/headers';

export default async function Login() {
	const redirectUrl = (await cookies()).get('redirectUrl')?.value || '';
	const isFromPoll = redirectUrl.includes('/poll/');

	return (
		<div className="flex flex-col items-center pt-[25vh]">
			<Tabs defaultValue="signin">
				<TabsList className={`grid w-full ${isFromPoll ? 'grid-cols-3' : 'grid-cols-2'}`}>
					<TabsTrigger value="signup" className="px-12">
						Registrieren
					</TabsTrigger>
					<TabsTrigger value="signin" className="px-12">
						Anmelden
					</TabsTrigger>
					{isFromPoll && (
						<TabsTrigger value="anonymous" className="px-12">
							Anonym
						</TabsTrigger>
					)}
				</TabsList>
				<Card className="w-full">
					<TabsContent value="signup" className="flex flex-col gap-4">
						<CardHeader>
							<CardTitle>Registrierung</CardTitle>
							<CardDescription>Erstelle ein Konto.</CardDescription>
						</CardHeader>
						<CardContent>
							<SignupForm />
						</CardContent>
					</TabsContent>
					<TabsContent value="signin" className="flex flex-col gap-4">
						<CardHeader>
							<CardTitle>Anmeldung</CardTitle>
							<CardDescription>Willkommen zurück!</CardDescription>
						</CardHeader>
						<CardContent>
							<SigninForm />
						</CardContent>
					</TabsContent>
					<TabsContent value="anonymous" className="flex flex-col gap-4">
						<CardHeader>
							<CardTitle>Anonyme Teilnahme</CardTitle>
							<CardDescription>Anonym teilnehmen sützt deine Privatsphäre.</CardDescription>
						</CardHeader>
						<CardContent>
							<AnonymousForm />
						</CardContent>
					</TabsContent>
				</Card>
			</Tabs>
		</div>
	);
}
