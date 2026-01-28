/* eslint @typescript-eslint/no-unused-vars: "off" */

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { z } from "zod";
import OffsetClock from "./OffsetClock.tsx";

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

function useSocketConnection(setError: (error: string) => void, isWatching: boolean) {
  const [now, setNow] = useState<null | Date>(null);

  useEffect(() => {
    fetch(CLOCK_URI + "/api/status")
      .then((response) => response.json())
      .then((json) => {
        const data = zStatusPayload.parse(json);
        setNow(new Date(data.currentTick));
      })
      .catch((err) => setError(`Unexpected error when fetching: ${err}`));
  }, []);

  const [watchers, setWatchers] = useState<null | number>(null);
  useEffect(() => {
    if (!isWatching) {
      console.log(`Not watching, no web socket connection`);
      return () => {
        console.log(`Not watching, so no cleanup to do`);
      };
    }
    console.log(`Establishing web socket connection`);
    const socket = io(CLOCK_URI);
    socket.on("tick", (payload) => {
      const data = zTickPayload.parse(payload);
      setNow(new Date(data.time));
      setWatchers(data.watchers);
    });
    return () => {
      console.log(`Closing web socket connection`);
      socket.disconnect();
    };
  }, [isWatching]);

  return { now, watchers };
}

export default function App() {
  const [error, setError] = useState<null | string>(null);
  const [isWatching, setIsWatching] = useState(false);
  const { now, watchers } = useSocketConnection(setError, isWatching);

  return (
    <div style={{ width: 600, margin: "auto" }}>
      {watchers !== null && `There are ${watchers} watcher(s)`}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1em",
        }}
      >
        {now === null && "Loading..."}
        {now !== null &&
          CLOCKS.map(({ id, offset }) => (
            <OffsetClock key={id} city={id} offset={offset} datetime={now} />
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
        {error === null && (
          <button onClick={() => setError("Why did you create problems on purpose?")}>
            Create an error
          </button>
        )}
        {error !== null && <button onClick={() => setError(null)}>Clear errors</button>}
        <button onClick={() => setIsWatching(!isWatching)}>
          {isWatching && "Stop"}
          {!isWatching && "Start"} watching
        </button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
