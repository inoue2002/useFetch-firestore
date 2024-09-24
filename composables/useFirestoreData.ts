import { useAsyncData } from '#app';
import { collection, getDocs, query } from 'firebase/firestore';
import { onServerPrefetch } from 'vue';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export function useFirestoreData(collectionName: string, conditions?: any[]) {
  const fetchData = async () => {
    console.log('fetchData', collectionName, conditions);
    // 時間ログ
    console.log(new Date().getTime())
    let q = collection(db, collectionName);

    // if (conditions) {
    //   q = query(q, ...conditions);
    // }

    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('DBにリクエストしました！', data);
    return data;
  };

  const { data, pending, error, refresh } = useAsyncData(
    `firestore-${collectionName}-${JSON.stringify(conditions)}`,
    fetchData,
    {
      server: false, // クライアントサイドのみで実行
      // SEOに関係ないデータとかは遅延読み込みしたい
      lazy: false, // 遅延読み込みしない
      immediate: true, // 即時読み込み
      getCachedData: (key) => {
        // キャッシュされたデータを取得
        const nuxtApp = useNuxtApp();
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
      transform: (result) => {
        // 必要に応じてデータを変換
        return result;
      },
      dedupe: 'cancel', // 同じキーの重複リクエストをキャンセル
    }
  );

  // SSRの場合はプリフェッチ
//   if (process.server) {
//     onServerPrefetch(async () => {
//       await refresh();
//     });
//   }

  return {
    data,
    pending,
    error,
    refresh,
  };
}
