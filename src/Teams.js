// Teams.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const Team = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
    });

    useEffect(() => {
        axios
            .get("https://fantasy-backend-wg63.onrender.com/teams")
            .then((response) => {
                setTeams(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching teams:", error);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://fantasy-backend-wg63.onrender.com/teams", formData);
            setFormData({
                name: "",
            });
            const updatedResponse = await axios.get("https://fantasy-backend-wg63.onrender.com/teams");
            setTeams(updatedResponse.data);
        } catch (error) {
            console.error("Error creating team:", error);
        }
    };

    return (
        <div
            className="team-display"
            style={{ maxWidth: "600px", margin: "0 auto" }}
        >
            <h2 style={{ marginBottom: "20px", marginTop: "17px" }}>Teams</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <label
                    htmlFor="name"
                    style={{ display: "block", marginBottom: "10px" }}
                >
                    Team Name:
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
                    Create Team
                </button>
            </form>
            {loading ? (
                <p style={{ textAlign: "center" }}>Loading teams...</p>
            ) : (
                <ul style={{ listStyleType: "none", padding: "0" }}>
                    {teams.map((team) => (
                        <li
                            key={team._id}
                            style={{
                                marginBottom: "10px",
                                backgroundColor: "#f9f9f9",
                                padding: "10px",
                                borderRadius: "4px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
                        >
                            {team.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Team;
