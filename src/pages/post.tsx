import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Image from "../components/image";
import {
    OutputType,
    PostType,
    ProfileType,
    StampType,
} from "../ts_types/types";
import getData from "../utilities/getData";

export default function Post() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [post, setPost] = useState<PostType>({
        id: "",
        profile: "",
        image: "",
        stamps: [],
        createdAt: "",
    });
    const [profile, setProfile] = useState({
        id: "",
        name: "",
        image: "",
        title: "",
        bio: "",
    });
    const [stamps, setStamps] = useState<StampType[]>([]);
    const [stampEnabled, setStampEnabled] = useState(false);

    useEffect(() => {
        const postId = searchParams.get("id");
        getData("/api/post?id=" + postId).then((output) => {
            const data = output as OutputType;
            switch (data.status) {
                case 200:
                    console.log(data.json);
                    setPost(data.json as PostType);
                    getData(
                        "/api/profile?id=" + (data.json as PostType).profile
                    ).then((output2) => {
                        console.log("profile", (output2 as OutputType).json);
                        setProfile((output2 as OutputType).json as ProfileType);
                    });
                    break;
                default:
                    navigate("/login");
                    return;
            }
        });
        getData("/api/post/stamps?id=" + postId).then((output2) => {
            console.log("stamps", (output2 as OutputType).json);
            setStamps((output2 as OutputType).json as StampType[]);
        });
    }, []);

    function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const targetDiv = e.currentTarget;

        const rect = targetDiv.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const boxDimX = rect.right - rect.left;
        const boxDimY = rect.bottom - rect.top;
        const postId = searchParams.get("id");
        let form = new FormData();

        form.append("x", Math.floor(x) as unknown as Blob);
        form.append("y", Math.floor(y) as unknown as Blob);
        form.append("boxDimX", Math.floor(boxDimX) as unknown as Blob);
        form.append("boxDimY", Math.floor(boxDimY) as unknown as Blob);
        form.append("postId", postId as string);

        console.log("CLICK", { rect, x, y, boxDimX, boxDimY });
        fetch("/post/stamp", {
            method: "POST",
            body: form,
        }).then(() => {
            getData("/api/post/stamps?id=" + postId).then((output2) => {
                console.log("stamps", (output2 as OutputType).json);
                setStamps((output2 as OutputType).json as StampType[]);
            });
        });
    }

    return (
        <div className="page">
            <div className="post">
                <div
                    className={
                        stampEnabled ? "post__top stamping" : "post__top"
                    }
                    onClick={(e) => {
                        if (stampEnabled) {
                            handleClick(e);
                        }
                    }}
                >
                    <Image class="post__top--image" image={post.image} />
                    {stamps.map((stamp) => (
                        <div
                            key={stamp.id}
                            className="stamp"
                            style={{
                                left: `calc(${stamp.x / 100}% - 24px)`,
                                top: `calc(${stamp.y / 100}% - 24px)`,
                                // left: `${stamp.x / 100}%`,
                                // top: `${stamp.y / 100}%`,
                            }}
                        >
                            <img src={stamp.image} alt="" />
                        </div>
                    ))}
                </div>

                <div className="post__middle">
                    <div
                        className="post__middle--enablestamp"
                        onClick={(e) => {
                            setStampEnabled(!stampEnabled);
                        }}
                    >
                        {stampEnabled ? "stop" : "start stamping"}
                    </div>
                    <p className="post__middle--credits">
                        <Link
                            className="post__middle--link"
                            to={"/profile?id=" + profile.id}
                        >
                            {profile.name}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
