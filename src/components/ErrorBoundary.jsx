import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  componentDidUpdate(prevProps) {
    // Reset when the user navigates to a different page
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "2rem", margin: 0 }}>⚠️</p>
          <h3 style={{ margin: "0.5rem 0" }}>Something went wrong on this page</h3>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            The rest of the portal still works. Try another page, or reload.
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: "0.75rem", padding: "0.5rem 1.25rem",
              background: "#e85d26", color: "#fff", border: "none",
              borderRadius: 8, cursor: "pointer", fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
