"use client"
import Link from 'next/link'
import Layout from '../components/Layout';
import { useRouter } from 'next/navigation';
import styles from '../styles/signup.module.css'; 
import { useState } from 'react';
import Image from 'next/image';

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError("");

        const formData = {
            username: e.target.username.value,
            password: e.target.password.value,
            passwordagain: e.target.passwordagain.value
        };

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ Redirect to login after successful signup
                router.push('/login');
            } else {
                setError(data.message || "Signup failed. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout pageTitle="Signup">
            <div className={styles.container}>
                <div className={styles.signupBox}>
                    {/* Logo */}
                    <Image 
                        src="/accent.png" 
                        alt="Accent Logo" 
                        className={styles.logo} 
                        width={280} 
                        height={280} 
                        priority
                    />

                    {error && <h3 className={styles.error}>{error}</h3>}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="username">Username</label>
                            <input name="username" type="text" placeholder="Username" required className={styles.input} />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Password</label>
                            <input name="password" type="password" placeholder="Password" required className={styles.input} />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="passwordagain">Enter your password again</label>
                            <input name="passwordagain" type="password" placeholder="Confirm Password" required className={styles.input} />
                        </div>

                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>

                    <p className={styles.signUpText}>
                        Already have an account?{' '}
                        <Link href="/login" className={styles.signUpLink}>Log in</Link>
                    </p>
                </div>
            </div>
        </Layout>
    );
}