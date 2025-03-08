import { useEffect, useState } from "react";
import axios from "axios";
import MemberHeader from "../components/MemberHeader";
import { User } from "@/types/User";
import { useIsMobile } from "@/context/MobileContext";

const Admin = () => {
    const [members, setMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedMember, setSelectedMember] = useState<User | null>(null); // State for modal

    const isMobile = useIsMobile();

    useEffect(() => {
        const fetchMembers = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/members`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMembers(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch members.");
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    return (
        <>
            {isMobile ? (
                <div className="min-h-screen text-black bg-gray-100">
                    <MemberHeader />
                    <div className="w-full mx-auto p-6 mt-20">
                        <h1 className="text-4xl md:text-6xl text-black mb-6 text-center">Admin Center</h1>

                        {loading && <p className="text-center text-gray-500">Loading members...</p>}
                        {error && <p className="text-center text-red-500">{error}</p>}

                        {!loading && !error && (
                            <>
                                {members.map((member) => (
                                    <div className="flex flex-col p-4 bg-white rounded-lg shadow-md mb-4" key={member._id}>
                                        <div className="flex items-center justify-between w-full">
                                            <div>
                                                {member.isAdmin && (
                                                    <span className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded-lg mr-2">
                                                        Admin
                                                    </span>
                                                )}
                                                <span className="font-medium">{member.firstName} {member.lastName}</span>
                                            </div>
                                            <span className={`px-3 py-1 font-bold rounded-lg ${getMembershipColor(member.membership)}`}>
                                                {member.membership}
                                            </span>
                                        </div>
                                        <div className="p-3">
                                            <ul className="space-y-2">
                                                <li className="flex text-black text-[12px]">
                                                    <span className="text-gray-500">Phone •&nbsp;</span>
                                                    <p>{member.phoneNumber || "N/A"}</p>
                                                </li>
                                                <li className="flex text-black text-[12px]">
                                                    <span className="text-gray-500">Email •&nbsp;</span>
                                                    <p>{member.email}</p>
                                                </li>
                                                <li className="flex text-black text-[12px]">
                                                    <span className="text-gray-500">Appointments •&nbsp;</span>
                                                    <p>{member.appointments.length}</p>
                                                </li>
                                                <li className="flex items-center text-black text-[12px]">
                                                    <span className="text-gray-500">Photo ID •&nbsp;</span>
                                                    <div>
                                                        {member.photoId ? (
                                                            <button
                                                                className="px-2 py-1 bg-orange-300 rounded-lg text-white text-nowrap cursor-pointer hover:bg-orange-400"
                                                                onClick={() => setSelectedMember(member)}
                                                            >
                                                                Check ID
                                                            </button>
                                                        ) : (
                                                            "Not Provided"
                                                        )}
                                                    </div>
                                                </li>
                                                <li className="flex items-center text-black text-[12px]">
                                                    <span className="text-gray-500">Verified ID •&nbsp;</span>
                                                    <div>
                                                        {member.verifiedId ? (
                                                            <button className="bg-green-200 border border-green-500 text-nowrap px-2 py-1 rounded-lg">
                                                                Verified
                                                            </button>
                                                        ) : (
                                                            <button className="px-2 py-1 bg-red-200 border border-red-500 text-nowrap rounded-lg">
                                                                Not Verified
                                                            </button>
                                                        )}
                                                    </div>
                                                </li>
                                                <li className="flex text-black text-[12px]">
                                                    <span className="text-gray-500">DOB •&nbsp;</span>
                                                    <p>{member.dob || "Not Provided"}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                </div>
            ) : (

                <div className="min-h-screen text-black bg-gray-100">
                    <MemberHeader />
                    <div className="w-full mx-auto p-6 mt-20">
                        <h1 className="text-4xl md:text-6xl text-black mb-6 text-center">Admin Center</h1>

                        {loading && <p className="text-center text-gray-500">Loading members...</p>}
                        {error && <p className="text-center text-red-500">{error}</p>}

                        {!loading && !error && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg shadow-md">
                                    <thead className="text-gray-700 text-nowrap">
                                        <tr>
                                            <th className="p-4 text-left"></th>
                                            <th className="p-4">Membership</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4">Phone</th>
                                            <th className="p-4">Appointments</th>
                                            <th className="p-4">Photo ID</th>
                                            <th className="p-4">Verified ID</th>
                                            <th className="p-4">DOB</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map((member) => (
                                            <tr key={member._id} className="border-t text-nowrap">
                                                <td className="p-4 flex items-center space-x-3">
                                                    {member.isAdmin && (
                                                        <span className="px-3 py-1 text-xs font-semibold bg-blue-500 text-white rounded-lg">
                                                            Admin
                                                        </span>
                                                    )}
                                                    <span className="font-medium">{member.firstName} {member.lastName}</span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-3 py-1 font-bold rounded-lg ${getMembershipColor(member.membership)}`}>
                                                        {member.membership}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">{member.email}</td>
                                                <td className="p-4 text-center">{member.phoneNumber || "N/A"}</td>
                                                <td className="p-4 text-center">{member.appointments.length}</td>
                                                <td className="p-4 text-center">
                                                    {member.photoId ? (
                                                        <button
                                                            className="px-2 py-1 bg-orange-300 rounded-lg text-white text-nowrap cursor-pointer hover:bg-orange-400"
                                                            onClick={() => setSelectedMember(member)}
                                                        >
                                                            Check ID
                                                        </button>
                                                    ) : (
                                                        "Not Provided"
                                                    )}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {member.verifiedId ? (
                                                        <button className="bg-green-200 border border-green-500 text-nowrap px-2 py-1 rounded-lg">
                                                            Verified
                                                        </button>
                                                    ) : (
                                                        <button className="px-2 py-1 bg-red-200 border border-red-500 text-nowrap rounded-lg">
                                                            Not Verified
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="p-4 text-center">{member.dob || "Not Provided"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            )}
            {/* Modal Component */}
            {selectedMember && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/80">
                    <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setSelectedMember(null)}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-semibold text-center">{selectedMember.firstName} {selectedMember.lastName}</h2>
                        <div className="mt-4 flex justify-center">
                            <img
                                src={`data:${selectedMember.photoId?.contentType};base64,${selectedMember.photoId?.data}`}
                                alt="ID"
                                className="w-72 h-48 object-cover rounded-md"
                            />
                        </div>
                        <div className="mt-4 flex justify-between px-6">
                            <button onClick={() => setSelectedMember(null)} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">
                                Verify
                            </button>
                            <button onClick={() => setSelectedMember(null)} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer">
                                Not Valid
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const getMembershipColor = (tier: string) => {
    switch (tier) {
        case "Gold": return "text-orange-300 font-bold";
        case "Silver": return "text-gray-400 font-bold";
        case "Bronze": return "text-orange-800 font-bold";
        default: return "bg-gray-300 text-black";
    }
};

export default Admin;
