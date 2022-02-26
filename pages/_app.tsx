import "../styles/globals.css"
import "./app.css"
import type { AppProps } from 'next/app';
import  Link from "next/link"



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav className="border-b p-6" style={{backgroundColor: "purple"}}>
        <p className="text4x1 font-bold text-white">Crepto Birdz MarketPlace</p>
        <div className="flex mt-4 justify-center">
          <Link href="/">
            <a className="mr-4">Main Marketplace</a>
          </Link>
          <Link href="/mint-nfts">
            <a className="mr-6">Mint Token</a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-6">My NFTs</a>
          </Link>
          <Link href="/account-dashboard">
            <a className="mr-4">Dashboard</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp;