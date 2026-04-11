"use client";

import { useAuth } from "@/app/providers";
import Link from "next/link";

export function ProfileAvatar() {
    const { user } = useAuth();

    if (!user) return null;

    // Determine background color based on gender
    const getBgColor = () => {
        if (user.gender === "male") {
            return "bg-blue-100";
        } else if (user.gender === "female") {
            return "bg-pink-100";
        } else {
            return "bg-red-100";
        }
    };

    const getTextColor = () => {
        if (user.gender === "male") {
            return "text-blue-700";
        } else if (user.gender === "female") {
            return "text-pink-700";
        } else {
            return "text-red-700";
        }
    };

    // Get first letter of name
    const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <Link href="/profile" className={`w-10 h-10 ${getBgColor()} rounded-full overflow-hidden border border-gray-200 flex items-center justify-center flex-shrink-0 hover:shadow-md transition-shadow font-bold ${getTextColor()}`}>
            {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
                firstLetter
            )}
        </Link>
    );
}
