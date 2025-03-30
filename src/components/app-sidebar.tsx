'use client';

import { Ticket, Vote, FilePlus, Library, User, LucidePaperclip } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarFooter,
} from '@/components/ui/sidebar';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Navigation items
const enterPoll = {
	title: 'Abstimmung beitreten',
	url: '/',
	icon: Ticket,
};
const myPolls = {
	title: 'Meine Abstimmungen',
	url: '/my-polls',
	icon: Library,
};

const createPoll = {
	title: 'Abstimmung erstellen',
	url: '/create',
	icon: FilePlus,
};
const myParticipations = {
	title: 'Meine Teilnahmen',
	url: '/my-participations',
	icon: Vote,
};

const profile = {
	title: 'Mein Profil',
	url: '/profile',
	icon: User,
};

const myPollRuns ={
	title: 'Meine Durchläufe',
	url: '/my-poll-runs',
	icon: LucidePaperclip,
}

export function AppSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menü</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem key={enterPoll.title}>
								<SidebarMenuButton asChild {...(pathname === enterPoll.url ? { isActive: true } : {})}>
									<Link href={enterPoll.url}>
										<enterPoll.icon />
										<span>{enterPoll.title}</span>{' '}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem key={myPolls.title}>
								<SidebarMenuButton asChild {...(pathname === myPolls.url ? { isActive: true } : {})}>
									<Link href={myPolls.url}>
										<myPolls.icon />
										<span>{myPolls.title}</span>{' '}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem key={myParticipations.title}>
								<SidebarMenuButton asChild {...(pathname === myParticipations.url ? { isActive: true } : {})}>
									<Link href={myParticipations.url}>
										<myParticipations.icon />
										<span>{myParticipations.title}</span>{' '}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem key={createPoll.title}>
								<SidebarMenuButton asChild {...(pathname === createPoll.url ? { isActive: true } : {})}>
									<Link href={createPoll.url}>
										<createPoll.icon />
										<span>{createPoll.title}</span>{' '}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem key={myPollRuns.title}>
								<SidebarMenuButton asChild {...(pathname === myPollRuns.url ? { isActive: true } : {})}>
									<Link href={myPollRuns.url}>
										<myPollRuns.icon />
										<span>{myPollRuns.title}</span>{' '}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem key={profile.title}>
						<SidebarMenuButton asChild {...(pathname === profile.url ? { isActive: true } : {})}>
							<Link href={profile.url}>
								<profile.icon />
								<span>{profile.title}</span>{' '}
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
