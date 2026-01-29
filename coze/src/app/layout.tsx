import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '生日记 - 亲友生日不忘',
    template: '%s | 生日记',
  },
  description:
    '生日记：记录亲友农历/阳历生日，日历提醒不错过重要时刻。支持农历转换、节假日显示，简单好用的生日提醒应用。',
  keywords: [
    '生日记',
    '生日提醒',
    '农历生日',
    '阳历生日',
    '亲友生日',
    '生日日历',
    '生日记录',
  ],
  authors: [{ name: '生日记', url: '#' }],
  // icons: {
  //   icon: '',
  // },
  openGraph: {
    title: '生日记 - 亲友生日不忘',
    description:
      '记录亲友农历/阳历生日，日历提醒不错过重要时刻。简单好用的生日提醒应用。',
    url: '#',
    siteName: '生日记',
    locale: 'zh_CN',
    type: 'website',
    // images: [
    //   {
    //     url: '',
    //     width: 1200,
    //     height: 630,
    //     alt: '扣子编程 - 你的 AI 工程师',
    //   },
    // ],
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Coze Code | Your AI Engineer is Here',
  //   description:
  //     'Build and deploy full-stack applications through AI conversation. No env setup, just flow.',
  //   // images: [''],
  // },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="en">
      <body className={`antialiased`} suppressHydrationWarning>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
