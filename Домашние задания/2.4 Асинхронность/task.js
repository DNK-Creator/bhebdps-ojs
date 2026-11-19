class AlarmClock {
    constructor() {
        // Массив для хранения звонков
        this.alarmCollection = [];

        // ID интервала
        this.intervalId = null;
    }

    // Добавление нового звонка
    addClock(time, callback) {
        // Проверяем наличие обязательных аргументов
        if (!time || typeof callback !== "function") {
            throw new Error("Отсутствуют обязательные аргументы");
        }

        // Проверяем, существует ли уже звонок на это время
        const isDuplicate = this.alarmCollection.some(
            alarm => alarm.time === time
        );

        if (isDuplicate) {
            console.warn("Уже присутствует звонок на это же время");
        }

        // Добавляем звонок в коллекцию
        this.alarmCollection.push({
            callback: callback,
            time: time,
            canCall: true
        });
    }

    // Удаление звонков по времени
    removeClock(time) {
        this.alarmCollection = this.alarmCollection.filter(
            alarm => alarm.time !== time
        );
    }

    // Получение текущего времени в формате HH:MM
    getCurrentFormattedTime() {
        const currentDate = new Date();

        const hours = String(currentDate.getHours()).padStart(2, "0");
        const minutes = String(currentDate.getMinutes()).padStart(2, "0");

        return `${hours}:${minutes}`;
    }

    // Запуск будильника
    start() {
        // Если интервал уже запущен, ничего не делаем
        if (this.intervalId !== null) {
            return;
        }

        this.intervalId = setInterval(() => {
            const currentTime = this.getCurrentFormattedTime();

            this.alarmCollection.forEach(alarm => {
                if (alarm.time === currentTime && alarm.canCall) {
                    alarm.canCall = false;
                    alarm.callback();
                }
            });
        }, 1000);
    }

    // Остановка будильника
    stop() {
        clearInterval(this.intervalId);

        // Сбрасываем ID интервала
        this.intervalId = null;
    }

    // Сброс возможности запуска всех звонков
    resetAllCalls() {
        this.alarmCollection.forEach(alarm => {
            alarm.canCall = true;
        });
    }

    // Удаление всех звонков
    clearAlarms() {
        // Останавливаем интервал
        this.stop();

        // Очищаем коллекцию звонков
        this.alarmCollection = [];
    }
}

const alarmClock = new AlarmClock();

// Добавляем звонки
alarmClock.addClock("08:00", () => {
    console.log("Доброе утро! Пора просыпаться!");
});

alarmClock.addClock("08:30", () => {
    console.log("Пора собираться на пары!");
});

alarmClock.addClock("09:00", () => {
    console.log("Ты опаздываешь!");
});

// Проверяем коллекцию
console.log(alarmClock.alarmCollection);

/*
[
    { callback: Function, time: "08:00", canCall: true },
    { callback: Function, time: "08:30", canCall: true },
    { callback: Function, time: "09:00", canCall: true }
]
*/

// Проверяем форматирование времени
console.log(alarmClock.getCurrentFormattedTime());
// Например: "16:25"

// Запускаем будильник
alarmClock.start();

// Повторный запуск не создаст второй интервал
alarmClock.start();

// Удаляем звонок на 08:30
alarmClock.removeClock("08:30");

// Сбрасываем возможность запуска всех звонков
alarmClock.resetAllCalls();

// Останавливаем будильник
alarmClock.stop();

// Удаляем все звонки и останавливаем интервал
alarmClock.clearAlarms();

try {
    alarmClock.addClock();
} catch (error) {
    console.log(error.message);
    // Отсутствуют обязательные аргументы
}

try {
    alarmClock.addClock("08:00");
} catch (error) {
    console.log(error.message);
    // Отсутствуют обязательные аргументы
}

alarmClock.addClock("08:00", () => {
    console.log("Первый звонок");
});

alarmClock.addClock("08:00", () => {
    console.log("Второй звонок");
});

// В консоли появится предупреждение:
// Уже присутствует звонок на это же время

alarmClock.addClock("10:00", () => console.log("Первый"));
alarmClock.addClock("11:00", () => console.log("Второй"));
alarmClock.addClock("12:00", () => console.log("Третий"));

alarmClock.removeClock("11:00");

console.log(alarmClock.alarmCollection.length);
// 2

alarmClock.clearAlarms();

console.log(alarmClock.alarmCollection);
// []

console.log(alarmClock.intervalId);
// null
