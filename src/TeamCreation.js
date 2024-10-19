import React, { useState, useEffect } from "react";
import axios from "axios";

const TeamCreation = () => {
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [teamName, setTeamName] = useState("");
    const [loading, setLoading] = useState(true);
    const [remainingRoles, setRemainingRoles] = useState({
        Batsman: 5,
        Bowler: 5,
        Wicketkeeper: 1,
        Captain: 1,
        "Vice Captain": 1,
        Allrounder: 2,
    });

    useEffect(() => {
        axios
            .get("http://localhost:5000/players")
            .then((response) => {
                setPlayers(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching players:", error);
                setLoading(false);
            });
    }, []);

    const handlePlayerSelection = (playerId) => {
        const selectedPlayer = players.find((player) => player._id === playerId);
        const isAlreadySelected = selectedPlayers.some(
            (player) => player._id === playerId
        );

        if (isAlreadySelected) {
            const updatedSelectedPlayers = selectedPlayers.filter(
                (player) => player._id !== playerId
            );
            setSelectedPlayers(updatedSelectedPlayers);

            setRemainingRoles((prev) => ({
                ...prev,
                [selectedPlayer.role]: prev[selectedPlayer.role] + 1,
            }));
        } else {
            const roleCount = selectedPlayers.filter(
                (player) => player.role === selectedPlayer.role
            ).length;
            const roleLimit = getRoleLimit(selectedPlayer.role);
            if (roleCount >= roleLimit) {
                alert(`You can select only ${roleLimit} ${selectedPlayer.role}(s).`);
                return;
            }

            setSelectedPlayers([...selectedPlayers, selectedPlayer]);

            setRemainingRoles((prev) => ({
                ...prev,
                [selectedPlayer.role]: prev[selectedPlayer.role] - 1,
            }));
        }
    };

    const getRoleLimit = (role) => {
        const roleLimits = {
            Batsman: 5,
            Bowler: 5,
            Wicketkeeper: 1,
            Captain: 1,
            "Vice Captain": 1,
            Allrounder: 2,
        };
        return roleLimits[role] || 0;
    };

    const handleTeamNameChange = (event) => {
        setTeamName(event.target.value);
    };

    const handleCreateTeam = () => {
        const requiredRoles = [
            "Batsman",
            "Bowler",
            "Wicketkeeper",
            "Captain",
            "Vice Captain",
            "Allrounder",
        ];

        for (const role of requiredRoles) {
            const roleCount = selectedPlayers.filter(
                (player) => player.role === role
            ).length;
            if (roleCount === 0) {
                alert(`Please select a ${role}.`);
                return;
            }
        }

        if (selectedPlayers.length !== 11) {
            alert(
                `Please select a total of 11 players. You currently have ${selectedPlayers.length} players selected.`
            );
            return;
        }

        const newTeam = {
            name: teamName,
            players: selectedPlayers.map((player) => player._id),
        };

        axios
            .post("http://localhost:5000/teams", newTeam)
            .then((response) => {
                alert("Team created successfully!");
                setSelectedPlayers([]);
                setTeamName("");
                setRemainingRoles({
                    Batsman: 5,
                    Bowler: 5,
                    Wicketkeeper: 1,
                    Captain: 1,
                    "Vice Captain": 1,
                    Allrounder: 2,
                });
            })
            .catch((error) => {
                console.error("Error creating team:", error);
            });
    };

    return (
        <div className="team-creation p-8 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Create Team</h2>
            {loading ? (
                <p>Loading data...</p>
            ) : (
                <div>
                    <label htmlFor="teamName" className="block font-semibold mb-2">
                        Team Name:
                    </label>
                    <input
                        type="text"
                        id="teamName"
                        value={teamName}
                        onChange={handleTeamNameChange}
                        className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                    />
                    <h4 className="font-semibold mb-2">Remaining to select:</h4>
                    <ul className="mb-4">
                        {Object.keys(remainingRoles).map((role) => (
                            <li key={role} className="text-gray-700">
                                {role}: {remainingRoles[role]} remaining
                            </li>
                        ))}
                    </ul>
                    <div className="mb-4">
                        {players.map((player) => (
                            <div key={player._id} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={player._id}
                                    checked={selectedPlayers.some(
                                        (p) => p._id === player._id
                                    )}
                                    onChange={() => handlePlayerSelection(player._id)}
                                    disabled={
                                        !selectedPlayers.some(
                                            (p) => p._id === player._id
                                        ) && remainingRoles[player.role] === 0
                                    }
                                    className="mr-2"
                                />
                                <label htmlFor={player._id} className="text-gray-800">
                                    <span className="text-blue-500">{player.name}</span>{" "}
                                    - Score: {player.score} -{" "}
                                    <span className="text-red-500">{player.role}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleCreateTeam}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create Team
                    </button>
                </div>
            )}
        </div>
    );
};

export default TeamCreation;
