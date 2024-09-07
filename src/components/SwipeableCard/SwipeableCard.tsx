import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { useSpring, animated } from "react-spring";

interface SwipeableCardProps {
    front: string;
    back: string;
    onApprove: () => void;
    onReject: () => void;
}

const SwipeableCard = forwardRef(({ front, back, onApprove, onReject }: SwipeableCardProps, ref) => {
    const [showBack, setShowBack] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [overlayColor, setOverlayColor] = useState("rgba(0, 0, 0, 0)");
    const [isVisible, setIsVisible] = useState(true);
    const [resetPosition, setResetPosition] = useState(false);
    const [isClick, setIsClick] = useState(true);

    useEffect(() => {
        setShowBack(false);
    }, [front, back]);


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === " ") {
                event.preventDefault();
                handleCardClick()
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isClick]);

    const springProps = useSpring({
        x: resetPosition ? 0 : currentPosition.x,
        y: resetPosition ? 0 : currentPosition.y,
        opacity: isVisible ? 1 : 0,
        transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
        config: {
            tension: 200,
            friction: 20,
            duration: resetPosition ? 200 : undefined,
        },
        immediate: resetPosition,
        onRest: () => {
            if (!isVisible) {
                setResetPosition(true);
                setCurrentPosition({ x: 0, y: 0 });
                setRotation(0);
                setOverlayColor("rgba(0, 0, 0, 0)");
                setIsVisible(true);
                setTimeout(() => setResetPosition(false), 0);
            }
        },
    });

    const handlePointerDown = (event: React.PointerEvent) => {
        setDragging(true);
        setIsClick(true);
        setDragStart({ x: event.clientX, y: event.clientY });
    };

    const handlePointerMove = (event: React.PointerEvent) => {
        if (dragging) {
            const deltaX = event.clientX - dragStart.x;
            if (Math.abs(deltaX) > 5) {
                setIsClick(false);
            }
            setCurrentPosition({ x: deltaX, y: 0 });

            const maxDelta = 300;
            const transitionFactor = Math.min(Math.abs(deltaX) / maxDelta, 1);

            if (deltaX > 0) {
                setOverlayColor(`rgba(0, 255, 0, ${transitionFactor * 0.5})`);
            } else if (deltaX < 0) {
                setOverlayColor(`rgba(255, 0, 0, ${transitionFactor * 0.5})`);
            }

            setRotation(deltaX / 20);
        }
    };

    const handlePointerUp = () => {
        if (dragging) {
            const maxDelta = 100;
            const deltaX = currentPosition.x;

            if (Math.abs(deltaX) > maxDelta * 0.7) {
                const direction = deltaX > 0 ? 1 : -1;
                if (direction > 0) {
                    approve();
                } else {
                    reject();
                }
            } else {
                resetCardPosition();
            }
            setDragging(false);
        }
    };

    const handleCardClick = () => {
        if (!dragging && isClick) {
            setShowBack((prev) => !prev);
        }
    };

    const approve = () => {
        setIsVisible(false);
        setCurrentPosition({ x: 1000, y: 0 });
        onApprove();
    };

    const reject = () => {
        setIsVisible(false);
        setCurrentPosition({ x: -1000, y: 0 });
        onReject();
    };

    const resetCardPosition = () => {
        setCurrentPosition({ x: 0, y: 0 });
        setRotation(0);
        setOverlayColor("rgba(0, 0, 0, 0)");
    };

    useImperativeHandle(ref, () => ({
        approve,
        reject,
    }));

    return (
        <animated.div
            className="relative w-full h-96 lg:h-[36rem] rounded-xl shadow-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center cursor-pointer select-none"
            style={{
                transform: springProps.transform,
                x: springProps.x,
                y: springProps.y,
                opacity: springProps.opacity,
                perspective: "1000px",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={handleCardClick}
        >
            <div
                className="absolute inset-0 rounded-xl"
                style={{
                    backgroundColor: overlayColor,
                }}
            ></div>
            <div className="relative w-full h-full flex items-center justify-center p-4 text-white">
                <div
                    className={`absolute w-full h-full flex items-center justify-center ${showBack ? "hidden" : "block"}`}
                    style={{
                        backfaceVisibility: "hidden",
                        transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                >
                    <p className="text-center text-8xl font-normal">{front}</p>
                </div>
                <div
                    className={`absolute w-full h-full flex items-center justify-center ${showBack ? "block" : "hidden"}`}
                    style={{
                        transform: showBack ? "rotateY(180deg)" : "rotateY(-180deg)",
                    }}
                >
                    <p className="text-center text-6xl font-normal">{back}</p>
                </div>
            </div>
        </animated.div>
    );
});

export default SwipeableCard;