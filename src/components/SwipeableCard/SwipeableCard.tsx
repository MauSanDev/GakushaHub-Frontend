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
            setRotation(deltaX / 20); // Controla la rotación, ajusta este valor para hacerla más o menos pronunciada
        }
    };

    const handlePointerUp = () => {
        setDragging(false);
        setCurrentPosition({ x: 0, y: 0 });
        setRotation(0); // Restaurar la rotación al soltar
        // Restaurar la capa transparente al soltar
        setOverlayColor("rgba(0, 0, 0, 0)");
    };

    const handleCardClick = () => {
        if (!dragging) {
            setShowBack((prev) => !prev);
        }
    };

    return (
        <div
            className="relative w-full h-96 lg:h-[36rem] rounded-xl shadow-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center cursor-pointer select-none"
            style={{
                transform: `translate(${currentPosition.x}px, ${currentPosition.y}px) rotate(${rotation}deg)`, // Aplicar la rotación
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
                <p className="text-center text-6xl font-normal">
                    {showBack ? back : front}
                </p>
            </div>
        </div>
    );
};

export default SwipeableCard;