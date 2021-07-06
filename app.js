import WordBubbles from '../pages/wordBubbles/wordBubbles'

export default function App() {
  const mainContainer = document.createElement('div');
  const appRef = document.querySelector('#app');

  let cb = {};
  let pages = {};
  let settings = null;
  let user = { userId: null, token: null };

  const setWord = (word) => fetch(`${defaultUrl}/users/${user.userId}/words/${word.id}`, {
    method: word.isUpdated ? 'PUT' : 'POST',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${user.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ optional: { status: word.status } }),
  })
    .then((res) => res.json());

  const setSettings = async (options) => {
    const rawResponse = await fetch(`${defaultUrl}/users/${user.userId}/settings`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        optional: options,
      }),
    });

    const content = await rawResponse.json();
    return content;
  };

  const setStatistics = () => {

  };

  const getSettingsCallback = () => settings;

  const getUserCallback = () => user;

  const getPagesCallback = () => pages;

  const getMainContainerCallback = () => mainContainer;

  const getAppContainerCallback = () => appRef;

  const setSettingsCallback = (options) => {
    setSettings(options);
    settings.optional = options;
  };

  const setWordCallback = (word) => {
    setWord(word);
  };

  const setWordsCallback = (words) => {
    const wordsFetch = words.map((word) => setWord(word));

    Promise.all(wordsFetch);

    if (settings.optional.linguist.isNewUser) {
      settings.optional.linguist.isNewUser = false;

      setSettings({ ...settings.optional });
    }
  };

  const getLoginDataCallback = async () => {
    const loginData = pages.loginPage.getData();
    user.userId = loginData.data.userId;
    user.token = loginData.data.token;

    setToLocalStorage('user', { userId: user.userId, token: user.token });

    const rawResponse = await fetch(`${defaultUrl}/users/${user.userId}/settings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === 404) {
      setSettings(defaultSettings);
      settings = { optional: defaultSettings };
    } else {
      const userSettings = await rawResponse.json();
      settings = userSettings;
    }

    const header = Header(mainContainer, cb);

    document.querySelector('#app').innerHTML = '';
    mainContainer.classList.add('app-container');
    mainContainer.innerHTML = '';

    header.onInit(document.querySelector('#app'));
    document.querySelector('#app').append(mainContainer);
    pages.mainPage.onInit(mainContainer);
  };

  const setCallbacks = () => {
    cb = {
      setSettingsCallback,
      setStatistics,
      getSettingsCallback,
      setWordsCallback,
      setWordCallback,
      getUserCallback,
      getPagesCallback,
      getMainContainerCallback,
      getLoginDataCallback,
      getAppContainerCallback,
    };

    return cb;
  };

  const setPages = () => {
    const mainPage = MainPage(cb);
    const linguistPage = Linguist(cb);
    const settingsPage = Settings(cb);
    const sprintPage = Sprint(cb);
    const aboutUsPage = AboutUs();
    const loginPage = Login(getLoginDataCallback);
    const vocabularyPage = Vocabulary(cb);
    const speakIt = SpeakIt(cb);
    const audioChallenge = AudioChallenge(cb);
    const savannah = Savannah(cb);
    const wordBubbles = WordBubbles(cb);
    pages = {
      mainPage, linguistPage, settingsPage, loginPage, sprintPage, aboutUsPage, speakIt, vocabularyPage, audioChallenge, savannah, wordBubbles,
    };
  };

  const startMainPage = (userSettings) => {
    settings = userSettings;

    setCallbacks();
    setPages();

    const header = Header(mainContainer, cb);

    document.querySelector('#app').innerHTML = '';
    mainContainer.classList.add('app-container');

    header.onInit(document.querySelector('#app'));
    document.querySelector('#app').append(mainContainer);
    pages.mainPage.onInit(mainContainer);
  };

  const haveToLogin = async () => {
    const rawResponse = await fetch(`${defaultUrl}/users/${user.userId}/settings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === 401) {
      pages.loginPage.onInit(appRef);
    } else if (rawResponse.status === 404) {
      setSettings(defaultSettings);
      settings = { optional: defaultSettings };
      startMainPage(settings);
    } else {
      const userSettings = await rawResponse.json();
      startMainPage(userSettings);
    }
  };

  const onInit = () => {
    user = getFromLocalStorage('user');
    if (!user) {
      user = { userId: null, token: null };
    }

    setCallbacks();
    setPages();

    haveToLogin();
  };

  const start = () => {
    onInit();
  };

  return {
    start,
  };
}
