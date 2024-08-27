import { useState } from "react";
import { useSpring, animated } from "react-spring";

interface SwipeableCardProps {
    front: string;
    back: string;
    onApprove: () => void;
    onReject: () => void;
}

const SwipeableCard = ({ front, back, onApprove, onReject }: SwipeableCardProps) => {
    const [showBack, setShowBack] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [overlayColor, setOverlayColor] = useState("rgba(0, 0, 0, 0)");
    const [isVisible, setIsVisible] = useState(true);
    const [resetPosition, setResetPosition] = useState(false);
    const [isClick, setIsClick] = useState(true);

    const springProps = useSpring({
        x: resetPosition ? 0 : currentPosition.x,
        y: resetPosition ? 0 : currentPosition.y,
        opacity: isVisible ? 1 : 0,
        transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
        config: {
            tension: 200,
            friction: 20,
            duration: resetPosition ? 200 : undefined, // Duración rápida solo en el reset
        },
        immediate: resetPosition, // Evitar transición de posición si estamos en la fase de reseteo
        onRest: () => {
            if (!isVisible) {
                // Al finalizar la animación de salida, resetea la posición sin animación
                setResetPosition(true);
                setCurrentPosition({ x: 0, y: 0 });
                setRotation(0);
                setOverlayColor("rgba(0, 0, 0, 0)");
                setIsVisible(true); // Inicia el fade in
                setTimeout(() => setResetPosition(false), 0); // Retirar el flag para permitir animaciones futuras
            }
        },
    });

    const handlePointerDown = (event: React.PointerEvent) => {
        setDragging(true);
        setIsClick(true); // Asume inicialmente que es un clic hasta que haya suficiente drag
        setDragStart({ x: event.clientX, y: event.clientY });
    };

    const handlePointerMove = (event: React.PointerEvent) => {
        if (dragging) {
            const deltaX = event.clientX - dragStart.x;
            if (Math.abs(deltaX) > 5) { // Si se ha arrastrado lo suficiente, no es un clic
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
            const maxDelta = 300;
            const deltaX = currentPosition.x;

            if (Math.abs(deltaX) > maxDelta * 0.7) {
                const direction = deltaX > 0 ? 1 : -1;
                if (direction > 0) {
                    onApprove(); // Llama a onApprove si la carta se mueve a la derecha
                } else {
                    onReject(); // Llama a onReject si la carta se mueve a la izquierda
                }
                // Transicionar hacia la posición final y desvanecer la carta
                setIsVisible(false);
                setCurrentPosition({ x: direction * 1000, y: 0 }); // Mover la carta fuera de la pantalla
            } else {
                // Resetear la carta a la posición original si no se supera el umbral
                setCurrentPosition({ x: 0, y: 0 });
                setRotation(0);
                setOverlayColor("rgba(0, 0, 0, 0)");
            }
            setDragging(false);
        }
    };

    const handleCardClick = () => {
        if (!dragging && isClick) {
            setShowBack((prev) => !prev);
        }
    };

    return (
        <animated.div
            className="relative w-full h-96 lg:h-[36rem] rounded-xl shadow-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center cursor-pointer select-none"
            style={{
                transform: springProps.transform,
                x: springProps.x,
                y: springProps.y,
                opacity: springProps.opacity,
                perspective: "1000px", // Esto añade un efecto 3D
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={handleCardClick}
        >
            {/* Capa transparente que cambia de color */}
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
                    {/* Customización del front */}
                    <p className="text-center text-8xl font-normal">
                        {front}
                    </p>
                </div>
                <div
                    className={`absolute w-full h-full flex items-center justify-center ${showBack ? "block" : "hidden"}`}
                    style={{
                        transform: showBack ? "rotateY(180deg)" : "rotateY(-180deg)",
                    }}
                >
                    <p className="text-center text-6xl font-normal">
                        {back}
                    </p>
                </div>
            </div>
        </animated.div>
    );
};

export default SwipeableCard;