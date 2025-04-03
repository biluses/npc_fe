"use client";
import BottomNavbar from "@/components/BottomNavbar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FriendPage = () => {
    const router = useRouter();

    const friends = [
        { id: 1, img: "/images/profile.jpg", online: true },
        { id: 2, img: "/images/profile.jpg", online: false },
        { id: 3, img: "/images/profile.jpg", online: true },
        { id: 4, img: "/images/profile.jpg", online: true },
        { id: 5, img: "/images/profile.jpg", online: false },
        { id: 6, img: "/images/profile.jpg", online: true },
        { id: 7, img: "/images/profile.jpg", online: true },
        { id: 8, img: "/images/profile.jpg", online: true },
    ];
    return (
        <div className="flex flex-col h-full">
            <div className="sticky top-0 bg-white w-full z-10 py-4 flex items-center">
                <button onClick={() => router.back()}>
                    <img src="/images/Back_Arrow_Icon.svg" alt="Back" />
                </button>
                <h1 className="mx-auto text-3xl font-bold">Amigos</h1>
            </div>
            <div className="sticky top-[68px] bg-white z-10">
                <div className="password-main-div">
                    <input type="text" name="search" placeholder="Buscar" className="relative common-input" />
                    <img src="/images/search_icon.svg" className="password-icon-img pr-2" alt="search_icon" />
                </div>
            </div>
            {/* <div className="pb-28 flex flex-wrap w-full bg-pink-400 my-5 h-auto gap-3 mx-auto">
                {friends.map((friend) => (
                    <div key={friend.id} className="xs:w-[80pt] xs:h-[80pt] w-[50pt] h-[50pt] flex relative">
                        <img
                            src={friend.img}
                            alt="Friend"
                            className="w-full h-full rounded-full object-cover border-2 border-gray-400"
                        />
                        {friend.online && (
                            <span className="absolute top-2 right-2 w-4 h-4 bg-cyan border-2 rounded-full border-white"></span>
                        )}
                    </div>
                ))}
            </div> */}
            <div className="pb-28 w-full my-5 mx-auto grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-4 gap-3">
                {friends.map((friend) => (
                    <div key={friend.id} className="aspect-square relative">
                        <img
                            src={friend.img}
                            alt="Friend"
                            className="w-full h-full rounded-full object-cover border border-white"
                        />
                        {friend.online && (
                            <span className="absolute top-2 right-2 w-4 h-4 bg-cyan border-2 rounded-full border-white"></span>
                        )}
                    </div>
                ))}
            </div>

            <BottomNavbar />
        </div>
    );
};

export default FriendPage;
