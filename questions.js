// questions.js 
// ORGA(β版) 質問データ 
// 軸①：問題解決姿勢 
// 軸②：連携姿勢 
const QUESTIONS = [ 
{ 
id: "Q01", 
axis: "axis1", 
axisName: "問題解決姿勢", 
questionType: "strong", 
score: 20, 
category: "違和感感度", 
text: "お気に入りのゲームアプリで以前と少し操作方法が変わっていた時、\nあなたはどう思いますか？", 
options: [ 
{ 
text: "何で変わったのか気になる", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "とりあえず新しい操作方法を覚える", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q02", 
axis: "axis1", 
axisName: "問題解決姿勢", 
questionType: "weak", 
score: 5, 
category: "違和感感度", 
text: "同じ映画を何度か見た時、あなたはどちらの状態に近いですか？", 
options: [ 
{ 
text: "前回気付かなかった細かい部分が気になる", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "全体の流れや雰囲気を楽しむ", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q03", 
axis: "axis1", 
axisName: "問題解決姿勢", 
questionType: "strong", 
score: 20, 
category: "改善欲求", 
text: "毎日使うリュックやカバンで、少し使いづらい部分があった時、\nあなたはどう思いますか？", 
options: [ 
{ 
text: "うまい使い方を考えてみる", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "繰り返し使用して慣れていく", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q04", 
axis: "axis1", 
axisName: "問題解決姿勢", 
questionType: "weak", 
score: 5, 
category: "改善欲求", 
text: "好きな料理を作ろうとレシピを確認しました。それを見てあなたはどう思いますか？", 
options: [ 
{ 
text: "レシピに対して少しアレンジを加えたくなる", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "レシピ通りの作り方を覚えようと思う", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q05", 
axis: "axis1", 
axisName: "問題解決姿勢", 
questionType: "strong", 
score: 20, 
category: "原因探究欲求", 
text: "楽しみにしていたイベントが急に中止になった時、あなたはどう思いますか？", 
options: [ 
{ 
text: "まず、なぜ中止になったのかを説明してほしい", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "まず、代替開催はいつになるのか教えてほしい", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q06", 
axis: "axis1", 
axisName: "問題解決姿勢", 
questionType: "weak", 
score: 5, 
category: "原因探究欲求", 
text: "スマートフォンのアプリのアイコンが少し変わっていた時、あなたはどう思いますか？", 
options: [ 
{ 
text: "なぜ変えたのか気になる", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "中身が同じなら特に気にならない", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q07", 
axis: "axis1", 
axisName: "問題解決姿勢", 
questionType: "strong", 
score: 20, 
category: "最適化欲求", 
text: "スマートフォンの設定が新しくなった時、あなたはどちらの状態に近いですか？", 
options: [ 
{ 
text: "今より使いやすくなるのか試してみたい", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "必要になったら使えばいいと思う", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q08", 
axis: "axis1", 
axisName: "問題解決姿勢", 
questionType: "weak", 
score: 5, 
category: "最適化欲求", 
text: "遊園地へ行った時、あなたはどちらの状態に近いですか？", 
options: [ 
{ 
text: "どの順番で回ると多く乗り物に乗れるか考える", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "その時の気分で乗りたいものを中心に回る", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q09", 
axis: "axis2", 
axisName: "連携姿勢", 
questionType: "strong", 
score: 20, 
category: "相談活用欲求", 
text: "初めて遊ぶボードゲームのルールが少し複雑だった時、あなたはどうしますか？", 
options: [ 
{ 
text: "知っている人に先にコツを聞く", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "まずは自分でルールを読んで理解しようとする", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q10", 
axis: "axis2", 
axisName: "連携姿勢", 
questionType: "weak", 
score: 5, 
category: "相談活用欲求", 
text: "初めて行く飲食店を選ぶ時、あなたはどのように選びますか？", 
options: [ 
{ 
text: "知っている人のおすすめを聞く", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "自分で探して決める", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q11", 
axis: "axis2", 
axisName: "連携姿勢", 
questionType: "strong", 
score: 20, 
category: "協力活用欲求", 
text: "地域のお祭りの準備を手伝うことになりました。\nあなたはどのように準備を進めますか？", 
options: [ 
{ 
text: "みんなと協力しながら準備を進める", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "与えられた役割をしっかり終わらせる", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q12", 
axis: "axis2", 
axisName: "連携姿勢", 
questionType: "weak", 
score: 5, 
category: "協力活用欲求", 
text: "合唱コンクールで歌う時、あなたは何を意識して歌いますか？", 
options: [ 
{ 
text: "全体のハーモニーを意識する", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "自分のパートをしっかり歌う", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q13", 
axis: "axis2", 
axisName: "連携姿勢", 
questionType: "strong", 
score: 20, 
category: "情報共有欲求", 
text: "新しくオープンしたテーマパークへ行った後、あなたはどうしますか？", 
options: [ 
{ 
text: "楽しかった場所やおすすめポイントを周りに話したくなる", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "自分の思い出として写真や動画を楽しむ", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q14", 
axis: "axis2", 
axisName: "連携姿勢", 
questionType: "weak", 
score: 5, 
category: "情報共有欲求", 
text: "面白い雑学を知った時、あなたはどうしますか？", 
options: [ 
{ 
text: "誰かに話したくなる", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "自分が知っていれば十分だと思う", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q15", 
axis: "axis2", 
axisName: "連携姿勢", 
questionType: "strong", 
score: 20, 
category: "役割分担思考", 
text: "文化祭で大きな展示物を作ることになりました。\nあなたはどちらの状態に近いですか？", 
options: [ 
{ 
text: "それぞれ得意な部分を担当した方が進めやすいと思う", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "自分の得意な部分はしっかり作り込みたいと思う", 
value: "negative", 
direction: "negative" 
} 
] 
}, 
{ 
id: "Q16", 
axis: "axis2", 
axisName: "連携姿勢", 
questionType: "weak", 
score: 5, 
category: "役割分担思考", 
text: "バーベキューをする時、あなたはどのように準備しますか？", 
options: [ 
{ 
text: "買い出しなどの役割を分担して進めたい", 
value: "positive", 
direction: "positive" 
}, 
{ 
text: "自分で買えるものは買って持っていきたい", 
value: "negative", 
direction: "negative" 
} 
] 
} 
]; 
