"use client";

import { useState, useEffect, useRef } from "react";
import {
  Flame,
  Dumbbell,
  Target,
  Heart,
  Play,
  Pause,
  Check,
  ChevronRight,
  X,
  Trophy,
  Clock,
  Calendar,
  Zap,
  Timer,
  Youtube,
} from "lucide-react";

const exercises = [
  {
    id: 1,
    section: "Calentamiento",
    icon: "flame",
    name: "Marcha en el lugar + movilidad",
    detail: "Círculos de brazos, cadera y tobillos",
    duration: 300,
    type: "time",
    videoId: null,
  },
  {
    id: 2,
    section: "Tren Inferior",
    icon: "leg",
    name: "Sentadillas asistidas",
    detail: "Con silla detrás como guía",
    sets: 3,
    reps: 10,
    rest: 45,
    type: "reps",
    videoId: "U3HlEF_E9fo",
  },
  {
    id: 3,
    section: "Tren Inferior",
    icon: "leg",
    name: "Zancadas estáticas",
    detail: "Apóyate en pared si necesitas",
    sets: 2,
    reps: 8,
    rest: 45,
    type: "reps",
    perSide: true,
    videoId: "L8fvypPrzzs",
  },
  {
    id: 4,
    section: "Tren Inferior",
    icon: "leg",
    name: "Puente de glúteos",
    detail: "Aprieta arriba 2 segundos",
    sets: 3,
    reps: 12,
    rest: 45,
    type: "reps",
    videoId: "OUgsJ8-Vi0E",
  },
  {
    id: 5,
    section: "Tren Superior",
    icon: "arm",
    name: "Flexiones inclinadas",
    detail: "Manos en cama o silla",
    sets: 3,
    reps: 8,
    rest: 50,
    type: "reps",
    videoId: "oKrqpvZd6hI",
  },
  {
    id: 6,
    section: "Tren Superior",
    icon: "arm",
    name: "Fondos de tríceps",
    detail: "En silla estable, piernas dobladas",
    sets: 2,
    reps: 8,
    rest: 50,
    type: "reps",
    videoId: "0326dy_-CzM",
  },
  {
    id: 7,
    section: "Tren Superior",
    icon: "arm",
    name: "Remo isométrico con toalla",
    detail: "En marco de puerta",
    sets: 3,
    duration: 10,
    rest: 30,
    type: "hold",
    videoId: "rloXYB8M3vU",
  },
  {
    id: 8,
    section: "Core",
    icon: "core",
    name: "Plancha frontal",
    detail: "Rodillas apoyadas si es necesario",
    sets: 3,
    duration: 20,
    rest: 30,
    type: "hold",
    videoId: "pvIjsG5Svck",
  },
  {
    id: 9,
    section: "Core",
    icon: "core",
    name: "Elevación piernas alternas",
    detail: "Acostada boca arriba",
    sets: 2,
    reps: 10,
    rest: 30,
    type: "reps",
    perSide: true,
    videoId: "l4kQd9eWclE",
  },
];

const SectionIcon = ({
  type,
  className = "w-6 h-6",
}: {
  type: string;
  className?: string;
}) => {
  switch (type) {
    case "flame":
      return <Flame className={className} />;
    case "leg":
      return <Zap className={className} />;
    case "arm":
      return <Dumbbell className={className} />;
    case "core":
      return <Target className={className} />;
    default:
      return <Dumbbell className={className} />;
  }
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [currentEx, setCurrentEx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("exercise");
  const [showVideo, setShowVideo] = useState(false);

  const ex = exercises[currentEx];
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (isRunning && timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
      
      if (timer === 0 && isRunning) {
        setIsRunning(false);
        const currentExercise = exercises[currentEx];
        
        if (phase === "rest") {
          if (currentExercise.sets && currentSet < currentExercise.sets) {
            setCurrentSet((s) => s + 1);
            setPhase("exercise");
            if (currentExercise.type === "hold" || currentExercise.type === "time")
              setTimer(currentExercise.duration || 0);
          } else {
            if (currentEx < exercises.length - 1) {
              const next = exercises[currentEx + 1];
              setCurrentEx(currentEx + 1);
              setCurrentSet(1);
              setPhase("exercise");
              setShowVideo(false);
              if (next.type === "hold" || next.type === "time")
                setTimer(next.duration || 0);
              else setTimer(0);
            } else setScreen("complete");
          }
        } else if (
          phase === "exercise" &&
          (currentExercise.type === "hold" || currentExercise.type === "time")
        ) {
          if (currentExercise.rest && currentExercise.sets && currentSet < currentExercise.sets) {
            setPhase("rest");
            setTimer(currentExercise.rest);
            setIsRunning(true);
          } else if (!currentExercise.sets || currentSet >= currentExercise.sets) {
            if (currentEx < exercises.length - 1) {
              const next = exercises[currentEx + 1];
              setCurrentEx(currentEx + 1);
              setCurrentSet(1);
              setPhase("exercise");
              setShowVideo(false);
              if (next.type === "hold" || next.type === "time")
                setTimer(next.duration || 0);
              else setTimer(0);
            } else setScreen("complete");
          }
        }
      }
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timer, phase, currentSet, currentEx]);

  const startWorkout = () => {
    setScreen("workout");
    setCurrentEx(0);
    setCurrentSet(1);
    setPhase("exercise");
    setShowVideo(false);
    if (exercises[0].type === "hold" || exercises[0].type === "time")
      setTimer(exercises[0].duration || 0);
  };

  const nextExercise = () => {
    if (currentEx < exercises.length - 1) {
      const next = exercises[currentEx + 1];
      setCurrentEx(currentEx + 1);
      setCurrentSet(1);
      setPhase("exercise");
      setIsRunning(false);
      setShowVideo(false);
      if (next.type === "hold" || next.type === "time")
        setTimer(next.duration || 0);
      else setTimer(0);
    } else setScreen("complete");
  };

  const completeSet = () => {
    if (ex.sets && currentSet < ex.sets) {
      setPhase("rest");
      setTimer(ex.rest || 0);
      setIsRunning(true);
    } else nextExercise();
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (screen === "home") {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 max-w-md w-full border border-white/20 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Rutina Full Body
            </h1>
            <p className="text-purple-300 text-sm">Entrenamiento en Casa</p>
            <span className="inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r from-purple-500 to-pink-500 text-white uppercase tracking-wider">
              Fase 1 • Principiante
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
              <Calendar className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">3x</div>
              <div className="text-xs text-slate-400">semana</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
              <Clock className="w-5 h-5 text-pink-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">35</div>
              <div className="text-xs text-slate-400">minutos</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
              <Zap className="w-5 h-5 text-amber-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">9</div>
              <div className="text-xs text-slate-400">ejercicios</div>
            </div>
          </div>

          <button
            onClick={startWorkout}
            className="w-full py-4 rounded-2xl font-bold text-white bg-linear-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" /> Comenzar Rutina
          </button>

          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Ejercicios
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {exercises.map((e, i) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 text-sm bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white font-bold">
                    {i + 1}
                  </span>
                  <SectionIcon
                    type={e.icon}
                    className="w-4 h-4 text-slate-400"
                  />
                  <span className="text-slate-300">{e.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "complete") {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center border border-white/20 shadow-2xl">
          <div className="w-20 h-20 bg-linear-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">¡Felicidades!</h1>
          <p className="text-slate-400 mb-6">Has completado tu rutina de hoy</p>
          <p className="text-slate-400 mb-6">
            Espero que te haya servido de mucho :D, si requieres mas ayuda me
            puedes decir.
          </p>
          <p className="text-slate-400 mb-6">Te quiere, Hector</p>
          <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
            <p className="text-sm text-slate-400 mb-1">
              Ejercicios completados
            </p>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
              {exercises.length} / {exercises.length}
            </p>
          </div>
          <button
            onClick={() => setScreen("home")}
            className="w-full py-4 rounded-2xl text-white font-bold bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" /> Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-3 flex flex-col">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 max-w-lg w-full mx-auto border border-white/20 shadow-2xl flex-1 flex flex-col">
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-slate-400 flex items-center gap-2">
              <SectionIcon type={ex.icon} className="w-4 h-4" /> {ex.section}
            </span>
            <span className="text-slate-500">
              {currentEx + 1} / {exercises.length}
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-linear-to-r from-purple-500 to-pink-500"
              style={{
                width: `${((currentEx + 1) / exercises.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
          {phase === "rest" ? (
            <>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Timer className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-400 mb-2">
                Descanso
              </h2>
              <div className="text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400 my-4 font-mono">
                {formatTime(timer)}
              </div>
              <p className="text-slate-500">
                Prepárate para la serie {currentSet + 1}
              </p>
            </>
          ) : (
            <>
              {showVideo ? (
                <div className="w-full">
                  <div
                    className="relative w-full rounded-2xl overflow-hidden"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${ex.videoId}?rel=0`}
                      title={ex.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <button
                    onClick={() => setShowVideo(false)}
                    className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-white/10 border border-white/10 flex items-center gap-2 mx-auto hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4" /> Cerrar video
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                    <SectionIcon
                      type={ex.icon}
                      className="w-8 h-8 text-purple-400"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {ex.name}
                  </h2>
                  <p className="text-slate-400 text-sm mb-4">{ex.detail}</p>

                  {ex.videoId && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors mb-4"
                    >
                      <Youtube className="w-4 h-4" /> Ver ejemplo
                    </button>
                  )}

                  {ex.type === "reps" && (
                    <div className="my-2">
                      <div className="text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
                        {ex.reps}
                      </div>
                      <div className="text-slate-400">
                        repeticiones {ex.perSide && "por lado"}
                      </div>
                    </div>
                  )}

                  {(ex.type === "hold" || ex.type === "time") && (
                    <div className="my-2">
                      <div className="text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400 font-mono">
                        {formatTime(timer || ex.duration || 0)}
                      </div>
                      <div className="text-slate-400">
                        {ex.type === "hold" ? "mantener" : ""}
                      </div>
                    </div>
                  )}

                  {ex.sets && (
                    <div className="flex gap-2 mt-4">
                      {[...Array(ex.sets)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${i < currentSet ? "bg-linear-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30" : "bg-white/10 text-slate-500 border border-white/10"}`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <div className="space-y-2">
          {phase === "exercise" &&
            (ex.type === "hold" || ex.type === "time") && (
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all ${isRunning ? "bg-white/20" : "bg-linear-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30"}`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" /> Iniciar Timer
                  </>
                )}
              </button>
            )}
          {phase === "exercise" && ex.type === "reps" && (
            <button
              onClick={completeSet}
              className="w-full py-3.5 rounded-2xl text-white font-bold bg-linear-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Serie Completada
            </button>
          )}
          <button
            onClick={nextExercise}
            className="w-full py-3 rounded-2xl font-semibold border border-white/20 text-slate-300 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-1"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScreen("home")}
            className="w-full py-2 text-slate-500 text-sm flex items-center justify-center gap-1 hover:text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" /> Salir
          </button>
        </div>
      </div>
    </div>
  );
}
