import React, { useState, useEffect } from "react";
import { File, FileText, Folder, FilePlus, HelpCircle } from "lucide-react";

const IconMatchGame = () => {
  const initialIcons = [
    { id: 1, icon: "file", matched: false },
    { id: 2, icon: "file", matched: false },
    { id: 3, icon: "fileText", matched: false },
    { id: 4, icon: "fileText", matched: false },
    { id: 5, icon: "folder", matched: false },
    { id: 6, icon: "folder", matched: false },
    { id: 7, icon: "filePlus", matched: false },
    { id: 8, icon: "filePlus", matched: false },
  ];

  const [icons, setIcons] = useState(initialIcons);
  const [selected, setSelected] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const getIcon = (iconName) => {
    switch (iconName) {
      case "file":
        return <File className="w-8 h-8" />;
      case "fileText":
        return <FileText className="w-8 h-8" />;
      case "folder":
        return <Folder className="w-8 h-8" />;
      case "filePlus":
        return <FilePlus className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const shuffleIcons = () => {
    const shuffled = [...initialIcons].sort(() => Math.random() - 0.5);
    setIcons(shuffled);
  };

  const handleIconClick = (clickedIcon) => {
    if (clickedIcon.matched || selected.length === 2 || selected.includes(clickedIcon)) {
      return;
    }

    setSelected((prev) => [...prev, clickedIcon]);
  };

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;

      if (first.icon === second.icon) {
        setIcons((prev) =>
          prev.map((icon) =>
            icon.id === first.id || icon.id === second.id
              ? { ...icon, matched: true }
              : icon
          )
        );
      }

      setTimeout(() => setSelected([]), 1000);
    }
  }, [selected]);

  useEffect(() => {
    shuffleIcons();
  }, []);

  useEffect(() => {
    const allMatched = icons.every((icon) => icon.matched);
    // Only set gameOver to true if all icons are matched
    if (allMatched && icons.length > 0) {
      setGameOver(true);
    }
  }, [icons]);

  const restartGame = () => {
    const shuffled = [...initialIcons].sort(() => Math.random() - 0.5);
    setIcons(shuffled);
    setSelected([]);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto p-4">
      <div className="w-full bg-purple-100 rounded-lg shadow-lg p-6">
        <h2 className="text-center text-2xl font-bold mb-6">Match the Icons While Your PDF is Compressing!</h2>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-4 mb-6">
            {icons.map((icon) => (
              <div
                key={icon.id}
                className={`
                  aspect-square flex items-center justify-center
                  rounded-lg transition-all duration-300 cursor-pointer
                  p-2 sm:p-4
                  ${icon.matched
                    ? "bg-purple-500 text-white"
                    : selected.includes(icon)
                      ? "bg-blue-100"
                      : "bg-white hover:bg-gray-50"
                  }
                  ${selected.includes(icon) ? "scale-105" : ""}
                  border-2 border-gray-200
                `}
                onClick={() => handleIconClick(icon)}
              >
                {selected.includes(icon) || icon.matched ? (
                  <div className="transform transition-transform duration-300">
                    {getIcon(icon.icon)}
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-4">


          {gameOver && (
            <div className="animate-bounce text-2xl font-bold text-purple-500">
              YOU WIN! 🎉
            </div>
          )}

          <button
            onClick={restartGame}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200"
          >
            Restart Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default IconMatchGame;