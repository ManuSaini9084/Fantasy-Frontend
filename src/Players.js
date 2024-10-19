//Players.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const Players = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        score: 0,
        role: "",
    });

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/players");
            setPlayers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching players:", error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "score" ? parseInt(value) : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/players", formData);
            setFormData({
                name: "",
                score: 0,
                role: "",
            });
            fetchPlayers();
        } catch (error) {
            console.error("Error creating player:", error);
        }
    };

    return (
        <div className="players" 
             style={{ maxWidth: "300px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "20px", marginTop: "25px" }}>
                Players
            </h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <label
                    htmlFor="name"
                    style={{ display: "block", marginBottom: "10px" }}
                >
                    Player Name:
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "8px",
                        fontSize: "16px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
                <label
                    htmlFor="score"
                    style={{ display: "block", 
                             marginBottom: "10px", 
                             marginTop: "10px" }}
                >
                    Score:
                </label>
                <input
                    type="number"
                    id="score"
                    name="score"
                    value={formData.score}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "8px",
                        fontSize: "16px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
                <label
                    htmlFor="role"
                    style={{ display: "block", 
                             marginBottom: "10px", 
                             marginTop: "10px" }}
                >
                    Role:
                </label>
                <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "8px",
                        fontSize: "16px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        marginTop: "10px",
                        padding: "8px 16px",
                        fontSize: "16px",
                        backgroundColor: "#1a8b9d",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Create Player
                </button>
            </form>
            {loading ? (
                <p style={{ textAlign: "center" }}>Loading...</p>
            ) : players.length > 0 ? (
                <ul style={{ listStyleType: "none", padding: "0" }}>
                    {players.map((player) => (
                        <li
                            key={player._id}
                            style={{
                                marginBottom: "10px",
                                backgroundColor: "#f9f9f9",
                                padding: "10px",
                                borderRadius: "4px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                        >
                            {player.name} - Score: {player.score}
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ textAlign: "center" }}>No players available</p>
            )}
        </div>
    );
};

export default Players;
