import React, { useState, useEffect } from "react";

const BookRide = () => {

    const [user, setUser] = useState(null);
    const [form, setForm] = useState({
        source: "",
        destination: "",
        required_seat: ""
    });

    const [result, setResult] = useState(null);

    // 🔥 Load user from localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser) {
            alert("Please login first");
            window.location.href = "/";
        } else {
            setUser(storedUser);
        }
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            user_id: user.user_id  // 🔥 auto attach
        };

        const res = await fetch("http://localhost:5000/api/book/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        setResult(data);
    };

    return (
        <div style={styles.container}>
            <h2>Welcome, {user?.name}</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="source"
                    placeholder="Source"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="destination"
                    placeholder="Destination"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="required_seat"
                    placeholder="Seats"
                    onChange={handleChange}
                    required
                />

                <button type="submit">Book Ride</button>
            </form>

            {result && (
                <div style={styles.result}>
                    <h3>Booking Success ✅</h3>
                    <p>User: {result.user_name}</p>
                    <p>Distance: {result.distance.toFixed(2)} km</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: "40px",
        textAlign: "center"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        width: "300px",
        margin: "auto",
        gap: "10px"
    },
    result: {
        marginTop: "20px",
        background: "#d1fae5",
        padding: "10px"
    }
};

export default BookRide;