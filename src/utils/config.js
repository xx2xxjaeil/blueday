export const interpretWeather = (sky, pty) => ({
  pty:
    {
      0: '없음',
      1: '비',
      2: '비/눈',
      3: '눈',
      4: '소나기'
    }[pty] || '알 수 없음',
  sky:
    {
      1: '맑음',
      3: '구름 많음',
      4: '흐림'
    }[sky] || '알 수 없음'
});
