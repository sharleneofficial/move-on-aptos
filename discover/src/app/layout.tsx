import type { Metadata } from 'next'
import { Bai_Jamjuree as FontSans } from 'next/font/google'
import './globals.css'

import { cn } from '@/lib/utils'

import { headers } from 'next/headers'

import { cookieToInitialState } from 'wagmi'
import Providers from '@/lib/providers'
import Web3ModalProvider from '@/lib/providers'
import { config } from '@/lib/wagmi'


const fontSans = FontSans({
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-sans',
})
export const metadata: Metadata = {
	title: 'Myriadflow Discover',
	description: 'Discover Phygital NFTs',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const initialState = cookieToInitialState(config, headers().get('cookie'))
	return (
		<html lang='en' suppressHydrationWarning>
			<Providers>
				<body
					className={cn(
						'min-h-screen bg-[#FAF9F6] font-sans antialiased',
						fontSans.variable
					)}
				>
				<Web3ModalProvider initialState={initialState}>{children}</Web3ModalProvider>
				</body>
			</Providers>
		</html>
	)
}
