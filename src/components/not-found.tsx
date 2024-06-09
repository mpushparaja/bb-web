import { useLocation, Link } from "react-router-dom";
export default function NotFound() {
    let route =  useLocation(); 
    return (
        <>
            {
                route.state ? route.state.error : 
                <div className="mt-5">
                    <h3>Page not found</h3>
                    <div className="mt-5">We're sorry, we couldn't find the page you requested.</div>
                    <div>You may have mistyped the address or the page may have moved</div>
                    <div className="mt-3">
                        <Link className="me-3 py-2 link-body-emphasis text-decoration-none" to="/">Take me back to the home page</Link>
                    </div>
                </div>
            }
        </>
    )
} 
