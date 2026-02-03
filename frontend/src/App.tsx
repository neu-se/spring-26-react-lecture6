/* eslint @typescript-eslint/no-unused-vars: "off" */

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";
import { z } from "zod";
import OffsetClock from "./OffsetClock.tsx";
import { TimeContext } from "./TimeContext.ts";

/** Base URL of the clock server */
const CLOCK_URI = "https://clock-socket.onrender.com";

/** Expected payload for the "/api/status" GET endpoint */
const zStatusPayload = z.object({
  currentTick: z.iso.datetime(),
  currentCount: z.int().gte(0),
});

/** Expected payload for the "count" socket.io event */
const zCountPayload = z.object({
  count: z.int().gte(0),
  watchers: z.int().gte(0),
});

/** Expected payload for the "tick" socket.io event */
const zTickPayload = z.object({
  time: z.iso.datetime(),
  watchers: z.int().gte(0),
});

const CLOCKS = [
  { id: "Atlanta", offset: -5 },
  { id: "Boston", offset: -5 },
  { id: "Los Angeles", offset: -8 },
  { id: "London", offset: 0 },
  { id: "Tokyo", offset: 9 },
];

function useTimeServer(
  setError: (err: string) => void,
  isWatching: boolean,
) {
  const [now, setNow] = useState<null | Date>(null);
  const [watchers, setWatchers] = useState<number>(0);

  useEffect(() => {
    fetch(CLOCK_URI + "/api/status")
      .then((response) => response.json())
      .then((json) => {
        const data = zStatusPayload.parse(json);
        setNow(new Date(data.currentTick));
      })
      .catch((err) =>
        setError(`Unexpected error when fetching: ${err}`),
      );
  }, []);

  useEffect(() => {
    if (!isWatching) return;
    console.log("Setting up web socket");
    const socket = io(CLOCK_URI);

    socket.on("tick", (payload) => {
      const data = zTickPayload.parse(payload);
      setNow(new Date(data.time));
      setWatchers(data.watchers);
      console.log(payload);
    });

    return () => {
      console.log("Shutting down web socket");
      socket.disconnect();
    };
  }, [isWatching]);

  return { now, watchers };
}

export default function App() {
  const [error, setError] = useState<null | string>(null);
  const [isWatching, setIsWatching] = useState(false);
  const { now, watchers } = useTimeServer(
    setError,
    isWatching,
  );

  return (
    <TimeContext value={now}>
      <div style={{ width: 600, margin: "auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1em",
          }}
        >
          {now &&
            CLOCKS.map(({ id, offset }) => (
              <OffsetClock
                key={id}
                city={id}
                offset={offset}
              />
            ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
            paddingBlock: "1em",
          }}
        >
          {error === null ? (
            <button
              onClick={() =>
                setError(
                  "Why did you create problems on purpose?",
                )
              }
            >
              Create an error
            </button>
          ) : (
            <button onClick={() => setError(null)}>
              Clear errors
            </button>
          )}
          <button
            onClick={() => setIsWatching(!isWatching)}
          >
            {isWatching ? "Stop" : "Start"} watching the
            clock
          </button>
        </div>
        {error && (
          <div style={{ color: "red" }}>{error}</div>
        )}
        {isWatching && (
          <div>There are {watchers} watchers.</div>
        )}
      </div>
    </TimeContext>
  );
}
