import { Link, useNavigate } from "react-router-dom";
import React from "react";
import Image from "./image";

import world from "../icons/round_language_white_48dp.png";
import home from "../icons/round_home_white_48dp.png";
import people from "../icons/round_people_white_48dp.png";
import search from "../icons/round_search_white_48dp.png";
import logout from "../icons/round_logout_white_48dp.png";
interface PropsType {
    children?: React.ReactNode;
}
function Menu(props: PropsType) {
    const navigate = useNavigate();
    return (
        <nav className="navigation">
            <Link className="navigation__link" to="/public">
                <Image className="image--menu" image={world} />
            </Link>
            <Link className="navigation__link" to="/home" reloadDocument>
                <Image className="image--menu" image={home} />
            </Link>
            <Link className="navigation__link" to="/search">
                <Image className="image--menu" image={search} />
            </Link>
            <Link className="navigation__link" to="/following">
                <Image className="image--menu" image={people} />
            </Link>
            <Link
                className="navigation__link"
                to="/login"
                onClick={() => {
                    fetch("/api/logout").then(() => {
                        navigate("/login");
                    });
                }}
            >
                <Image className="image--menu" image={logout} />
            </Link>
            {props.children}
        </nav>
    );
}

export default Menu;
