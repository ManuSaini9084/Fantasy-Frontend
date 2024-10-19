import React, { useState, useEffect } from "react";
import axios from "axios";

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    // States for match creation
    const [newMatch, setNewMatch] = useState({
        date: "",
        team1: "",
        team2: "",
        winner: ""
    });

    // Fetch matches and teams when the component mounts
    useEffect(() => {
        const fetchMatchesAndTeams = async () => {
            try {
                const matchResponse = await axios.get("https://fantasy-backend-wg63.onrender.com/matches");
                const teamResponse = await axios.get("https://fantasy-backend-wg63.onrender.com/teams");
                setMatches(matchResponse.data);
                setTeams(teamResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchMatchesAndTeams();
    }, []);

    // Handle input changes for creating a new match
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMatch({ ...newMatch, [name]: value });
    };

    // Handle form submission for creating a new match
    const handleCreateMatch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://fantasy-backend-wg63.onrender.com/matches", {
                date: newMatch.date,
                teams: [newMatch.team1, newMatch.team2],
                winner: newMatch.winner,
            });

            // Update the match list with the new match
            setMatches([...matches, response.data]);

            // Clear form inputs
            setNewMatch({ date: "", team1: "", team2: "", winner: "" });
        } catch (error) {
            console.error("Error creating match:", error);
        }
    };

    // Helper function to get team name by ID
    const getTeamNameById = (id) => {
        const team = teams.find((t) => t._id === id);
        return team ? team.name : "Unknown Team";
    };

    return (
        <div className="matches-container max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-center text-teal-600">Matches</h1>

            {/* Match Creation Form */}
            <form onSubmit={handleCreateMatch} className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Create a New Match</h2>
                <div className="mb-4">
                    <label className="block mb-1">Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={newMatch.date}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Team 1:</label>
                    <select
                        name="team1"
                        value={newMatch.team1}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="">Select Team 1</option>
                        {teams.map((team) => (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Team 2:</label>
                    <select
                        name="team2"
                        value={newMatch.team2}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="">Select Team 2</option>
                        {teams.map((team) => (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Winner:</label>
                    <select
                        name="winner"
                        value={newMatch.winner}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="">Select Winner</option>
                        {teams.map((team) => (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700 transition duration-300">
                    Create Match
                </button>
            </form>

            {/* Matches List */}
            {loading ? (
                <p className="text-center text-lg text-gray-600">Loading...</p>
            ) : matches.length > 0 ? (
                <ul className="list-none p-0">
                    {matches.map((match) => (
                        <li key={match._id} className="p-4 mb-4 bg-white rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-shadow duration-300">
                            <div>
                                <span className="font-bold text-lg">{new Date(match.date).toLocaleString()}</span>
                                <div className="text-lg">
                                    {getTeamNameById(match.teams[0])} vs {getTeamNameById(match.teams[1])}
                                </div>
                            </div>
                            <span className="ml-4 text-sm text-gray-500">Winner: {match.winner ? getTeamNameById(match.winner) : "N/A"}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-lg text-gray-600">No matches available</p>
            )}
        </div>
    );
};

export default Matches;
