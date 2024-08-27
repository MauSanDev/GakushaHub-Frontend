import { useState } from "react";

interface SwipeableCardProps {
    front: string;
    back: string;
}

const SwipeableCard = ({ front, back }: SwipeableCardProps) => {
    const [showBack, setShowBack] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0); // Estado para la rotación
    const [overlayColor, setOverlayColor] = useState("rgba(0, 0, 0, 0)"); // Color de la capa transparente
    const [isVisible, setIsVisible] = useState(true); // Controla la visibilidad para el fade in/out

    const handlePointerDown = (event: React.PointerEvent) => {
        setDragging(true);
        setDragStart({ x: event.clientX, y: event.clientY });
    };

    const handlePointerMove = (event: React.PointerEvent) => {
        if (dragging) {
            const deltaX = event.clientX - dragStart.x;
            setCurrentPosition({ x: deltaX, y: 0 });

            // Calcular la transparencia según la distancia arrastrada
            const maxDelta = 300; // Distancia máxima para el cambio completo de color
            const transitionFactor = Math.min(Math.abs(deltaX) / maxDelta, 1); // Factor de transición entre 0 y 1

            if (deltaX > 0) {
                // Transición hacia verde
                setOverlayColor(`rgba(0, 255, 0, ${transitionFactor * 0.5})`);
            } else if (deltaX < 0) {
                // Transición hacia rojo
                setOverlayColor(`rgba(255, 0, 0, ${transitionFactor * 0.5})`);
            }

            // Actualizar la rotación en función del deltaX
            setRotation(deltaX / 20);
        }
    };

    const handlePointerUp = () => {
        if (dragging) {
            const maxDelta = 300;
            const deltaX = currentPosition.x;

            // Si se supera el umbral, la carta sigue moviéndose fuera de la pantalla
            if (Math.abs(deltaX) > maxDelta * 0.7) {
                const direction = deltaX > 0 ? 1 : -1;
                // Mover la carta fuera de la pantalla
                setCurrentPosition({ x: direction * 1000, y: 0 });
                setTimeout(() => {
                    // Desaparecer la carta y hacer un fade in
                    setIsVisible(false);
                    setTimeout(() => {
                        // Resetear la posición y hacer fade in en el centro
                        setCurrentPosition({ x: 0, y: 0 });
                        setRotation(0);
                        setOverlayColor("rgba(0, 0, 0, 0)");
                        setIsVisible(true);
                    }, 300);
                }, 300);
            } else {
                // Si no se supera el umbral, resetear a la posición inicial
                setCurrentPosition({ x: 0, y: 0 });
                setRotation(0);
                setOverlayColor("rgba(0, 0, 0, 0)");
            }
            setDragging(false);
        }
    };

    const handleCardClick = () => {
        if (!dragging) {
            setShowBack((prev) => !prev);
        }
    };

    return (
        <div
            className={`relative w-full h-96 lg:h-[36rem] rounded-xl shadow-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center cursor-pointer select-none transition-opacity duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
                transform: `translate(${currentPosition.x}px, ${currentPosition.y}px) rotate(${rotation}deg)`,
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
                <p className="text-center text-6xl font-normal">
                    {showBack ? back : front}
                </p>
            </div>
        </div>
    );
};

export default SwipeableCard;