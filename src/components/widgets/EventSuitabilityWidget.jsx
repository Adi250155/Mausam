import {
  getBestEventDay,
} from "../../features/events/eventSuitabilityEngine";

function formatDate(
  date
) {
  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return date;
  }

  return parsed.toLocaleDateString(
    [],
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    }
  );
}

function EventSuitabilityWidget({
  weather,
  answers = {},
}) {
  const days =
    getBestEventDay(
      weather,
      answers
    );

  if (!days?.length) {
    return (
      <section>
        <h2>
          Outdoor Event Suitability
        </h2>

        <p>
          Event suitability data unavailable.
        </p>
      </section>
    );
  }

  const best =
    days[0];

  return (
    <section>
      <h2>
        Outdoor Event Suitability
      </h2>

      <h3>
        Best Day
      </h3>

      <h1>
        {best.score}/100
      </h1>

      <h2>
        {best.label}
      </h2>

      <p>
        {formatDate(
          best.date
        )}
      </p>

      <p>
        Rain:{" "}
        {best.rainProbability}%
      </p>

      <p>
        Temperature:{" "}
        {Math.round(
          best.temperature
        )}
        °C
      </p>

      <p>
        Wind:{" "}
        {Math.round(
          best.wind
        )} km/h
      </p>

      {best.reasons.length >
        0 && (
        <div>
          <h3>
            Why?
          </h3>

          <ul>
            {best.reasons.map(
              (
                reason,
                index
              ) => (
                <li
                  key={`${reason}-${index}`}
                >
                  {reason}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      <h3>
        Other Days
      </h3>

      {days
        .slice(1, 4)
        .map(
          (day) => (
            <div
              key={day.date}
            >
              <strong>
                {formatDate(
                  day.date
                )}
              </strong>

              {" — "}

              {day.score}/100

              {" — "}

              {day.label}
            </div>
          )
        )}
    </section>
  );
}

export default EventSuitabilityWidget;