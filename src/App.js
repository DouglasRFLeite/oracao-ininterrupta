import logo from "./logo.png";
import "./App.css";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

function App() {
  function generateTimeIntervals() {
    const intervals = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const start = `${String(hour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}`;
        const nextMinute = (minute + 15) % 60;
        const nextHour = hour + Math.floor((minute + 15) / 60);
        const end = `${String(nextHour).padStart(2, "0")}:${String(
          nextMinute
        ).padStart(2, "0")}`;
        intervals.push(`${start} - ${end}`);
      }
    }
    return intervals;
  }

  const timeIntervals = generateTimeIntervals();
  const [inputs, setInputs] = useState({});
  const [occupiedTimes, setOccupiedTimes] = useState({});

  useEffect(() => {
    console.log(inputs);
    console.log(occupiedTimes);
  }, [inputs, occupiedTimes]);

  // Carregar horários preenchidos do Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "prayerTimes"),
      (snapshot) => {
        const data = {};
        snapshot.forEach((doc) => {
          data[doc.id] = doc.data().participants || [];
        });
        setOccupiedTimes(data);
      }
    );
    return () => unsubscribe(); // Limpa o listener
  }, []);

  // Lidar com mudanças nos inputs
  const handleInputChange = (interval, value) => {
    setInputs((prev) => ({
      ...prev,
      [interval]: value,
    }));
  };

  // Salvar horário no Firestore
  const saveData = async () => {
    const updates = [];
    for (const interval in inputs) {
      if (inputs[interval]) {
        const docRef = doc(db, "prayerTimes", interval);
        updates.push(
          updateDoc(docRef, {
            participants: arrayUnion({
              name: inputs[interval],
              timestamp: new Date().toISOString(),
            }),
          }).catch(async (error) => {
            if (error.code === "not-found") {
              await setDoc(docRef, {
                participants: [
                  {
                    name: inputs[interval],
                    timestamp: new Date().toISOString(),
                  },
                ],
              });
            }
          })
        );
      }
    }
    await Promise.all(updates);
    alert("Dados salvos com sucesso!");
    setInputs({});
  };

  return (
    <main className="bg-red-900">
      <div className="bg-red-900 h-1 items-center"></div>
      <section className="bg-red-900 flex flex-col items-center gap-2 text-white font-bold fixed left-0 right-0 top-0 py-10">
        <img src={logo} alt="logo" className="h-20 w-fit m-auto" />
        <h1 className="text-2xl">Igreja Cristã Maranata - Portão</h1>
        <h1>Oração Ininterrupta 24h - 29/11/2024</h1>
        <p>Insira seu nome ao lado do horário em que irá orar</p>
        <div className="flex justify-center mt-5">
          <button
            className="bg-red-500 text-white px-12 py-2 rounded"
            onClick={saveData}
          >
            Salvar Alterações
          </button>
        </div>
      </section>
      <section className="my-[40vh]">
        {timeIntervals.map((interval) => (
          <div className="flex justify-center items-center" key={interval}>
            <p className="bg-slate-300 text-red-950 w-fit h-8 p-1 rounded-s-lg my-1">
              {interval}
            </p>
            <input
              className="h-8 p-3 rounded-e-lg"
              value={
                occupiedTimes[interval]?.[0].name || inputs[interval] || ""
              }
              onChange={(e) => handleInputChange(interval, e.target.value)}
              disabled={occupiedTimes[interval]?.length >= 1} // Desabilitar se o horário já estiver preenchido
            />
            {/* {occupiedTimes[interval]?.map((participant, index) => (
              <span
                key={index}
                className="ml-2 text-sm bg-green-500 text-white p-1 rounded"
              >
                {participant.name}
              </span>
            ))} */}
          </div>
        ))}
      </section>
      <div className="bg-red-900 h-10 items-center"></div>
    </main>
  );
}

export default App;
