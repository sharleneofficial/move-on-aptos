"use client"
import React, {useState, useEffect} from 'react'
import Link from 'next/link';
import Cookies from "js-cookie";

const Header1 = () => {

  const wallet = Cookies.get("discover_wallet");

  const [isScrolled, setIsScrolled] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [hovered, setHovered] = useState(false);
  
  const logout = {
    color: hovered ? "red" : "black",
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const getRandomNumber = () => Math.floor(Math.random() * 1000);
        const apiUrl = `https://api.multiavatar.com/${getRandomNumber()}`;

        const response = await axios.get(apiUrl);
        const svgDataUri = `data:image/svg+xml,${encodeURIComponent(response.data)}`;
        setAvatarUrl(svgDataUri);
      } catch (error) {
        console.error('Error fetching avatar:', error.message);
      }
    };

    fetchData();
  }, []);


  const getAptosWallet = () => {
    if ("aptos" in window) {
      return window.aptos;
    } else {
      window.open("https://petra.app/", "_blank");
    }
  };

  const connectWallet = async () => {
    const aptosWallet = getAptosWallet();
    try {
      const response = await aptosWallet.connect();
      console.log(response); // { address: string, publicKey: string }
      // Check the connected network
      const network = await aptosWallet.network();
      if (network === "Testnet") {

        // signing message
        const payload = {
          message: "Hello from Myriadflow Discover",
          nonce: Math.random().toString(16),
        };
        const res = await aptosWallet.signMessage(payload);
        // signing message

        Cookies.set("discover_wallet", response.address, { expires: 7 });
        window.location.reload();
      } else {
        alert(`Switch to Testnet in your Petra wallet`);
      }
    } catch (error) {
      console.error(error); // { code: 4001, message: "User rejected the request."}
    }
  };

  const handleDeleteCookie = () => {
    Cookies.remove("discover_wallet");
    window.location.href = "/";
  };

  return (
    <div className="px-10"
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      background: isScrolled ? 'black' : 'transparent',
      transition: 'background 0.3s ease-in-out',
      color: isScrolled ? 'white' : 'black',
        paddingBottom: '10px'
    }}>
        <div className='mt-4'>
            <img src={isScrolled ? "/logo2.png" : "/logo.png"} 
            style={{width:'200px'}}/>
        </div>
        <div style={{display:'flex', gap:'40px', fontSize:'20px'}} className="font-bold mt-10">
<Link href="https://myriadflow.com" target="_blank">Home</Link>
<Link href="">Explore</Link>
<Link href="/allcollections">Collections</Link>
<Link href="/allbrands">Brands</Link>
        </div>
        <div className="mt-6">
            {/* <button className="px-10 mt-10" style={{paddingTop:'5px', paddingBottom:'5px', borderRadius:'5px',
              background: isScrolled ? 'white' : 'black',
              color: isScrolled ? 'black' : 'white',
            }}>Connect</button> */}
            {/* <w3m-button /> */}
            {wallet ? (
          <div className="flex gap-4">
          <Link href="/profile">{avatarUrl && <img src={avatarUrl} alt="Avatar" style={{width: 45}}/>} </Link>
          <div>
          <div className="text-black rounded-lg text-lg font-bold text-center">
            {wallet.slice(0, 4)}...{wallet.slice(-4)}
          </div>
          <button
            onClick={handleDeleteCookie}
            style={logout}
            className="mx-auto hover:text-red-400 text-black text-lg font-bold"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            Logout
          </button>
          </div>
          </div>
      ):(
        <button className="text-black bg-white mt-2" style={{borderRadius:'10px', paddingLeft: '10px', paddingRight: '10px', paddingBottom: '8px', paddingTop: '8px'}} 
        onClick={connectWallet}>
        Connect with Petra
        </button>
      )}

        </div>
    </div>
  )
}

export default Header1