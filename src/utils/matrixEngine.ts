import { GenerationResult, MatrixStatus, VectorParameters, CharacterProfileOutput, AiPrompts, DesignMode, RenderStyle } from '../types';

/**
 * 年齢 (1.0 - 6.0) を X軸ウェイト (0% - 100%) に正規化変換
 * 数式: X_weight (%) = (target_age - 1.0) / (6.0 - 1.0) * 100
 */
export function calculateXWeight(targetAge: number): number {
  const clampedAge = Math.min(Math.max(targetAge, 1.0), 6.0);
  return Math.round(((clampedAge - 1.0) / 5.0) * 100);
}

/**
 * X軸ウェイトからデザインモード ('1-2yo' | '3-4yo' | '5-6yo') を決定
 */
export function determineDesignMode(xWeight: number): DesignMode {
  if (xWeight <= 30) return '1-2yo';
  if (xWeight <= 70) return '3-4yo';
  return '5-6yo';
}

/**
 * X軸ウェイトに基づき「6大ベクトル」パラメータを取得
 */
export function getVectorParameters(xWeight: number): VectorParameters {
  if (xWeight <= 30) {
    return {
      proportions: '1.2〜1.5頭身 / 完全球体・円ベース / 手足一体型',
      colorsAndOutlines: '超太線 (Ultra Thick Line) / 2〜3色 / 原色・パステル',
      faceStructure: '顔下部30%にパーツ集中 / 点目・離れ目 / 歯なし',
      abstraction: '超抽象・質感 (もちもち、丸、しずく)',
      namingConvention: 'オノマトペ・2音反復 / 3ステップ描画',
      poseAndMovement: 'ぽよん・受け身・揺れる (静的な可愛さ)'
    };
  } else if (xWeight <= 70) {
    return {
      proportions: '1.8〜2.0頭身 / 丸みのある楕円 / 手足分離',
      colorsAndOutlines: '太線 (Bold Line) / 3〜4色 / 明るいパステル',
      faceStructure: '顔下部40%にパーツ配置 / 光ドット目',
      abstraction: 'ハイブリッド・具象結合 (被り物、合体)',
      namingConvention: '愛称・組み合わせ名 / 4〜5ステップ描画',
      poseAndMovement: '首かしげ・ちょこんと座る'
    };
  } else {
    return {
      proportions: '2.2〜2.5頭身 / アクション可能なシルエット',
      colorsAndOutlines: '中太線 (Clean Line) / 4〜5色 / 差し色・模様追加',
      faceStructure: '顔中央にパーツ配置 / 表情・眉毛・キラキラ目',
      abstraction: '役割・道具・衣装付き (服、マント、職業)',
      namingConvention: '肩書・役職付き名前 / 5〜7ステップ描画',
      poseAndMovement: 'ジャンプ・決めポーズ (動的な躍動感)'
    };
  }
}

/**
 * 固有名詞と年齢モードから表現豊かなネーミングを自動生成
 */
function generateCreativeName(noun: string, mode: DesignMode): { name: string; reading: string; englishName: string } {
  const cleanNoun = noun.replace(/(向け|歳|才|モード)/g, '').trim();
  const lower = cleanNoun.toLowerCase();
  
  if (lower.includes('車') || lower.includes('くるま') || lower.includes('car') || lower.includes('バス')) {
    if (mode === '1-2yo') return { name: 'くまぽよカー', reading: 'くまぽよかー', englishName: 'Kumapoyo Car' };
    if (mode === '3-4yo') return { name: 'てちてちベアカー', reading: 'てちてちべあかー', englishName: 'Techitechi Bear-Car' };
    return { name: 'キャプテン・クマックスカー', reading: 'きゃぷてん・くまっくすかー', englishName: 'Captain KumaX Car' };
  }

  if (cleanNoun.includes('ニワトリ') || cleanNoun.includes('にわとり') || cleanNoun.includes('ひよこ')) {
    if (mode === '1-2yo') return { name: 'ぴよぽん', reading: 'ぴよぽん', englishName: 'Piyopon' };
    if (mode === '3-4yo') return { name: 'にわちゃん', reading: 'にわちゃん', englishName: 'Niwa-chan' };
    return { name: 'キング・コッコ', reading: 'きんぐ・こっこ', englishName: 'King Cocco' };
  }

  if (cleanNoun.includes('熊') || cleanNoun.includes('くま') || cleanNoun.includes('ベア')) {
    if (mode === '1-2yo') return { name: 'くまぽよ', reading: 'くまぽよ', englishName: 'Kumapoyo' };
    if (mode === '3-4yo') return { name: 'くまるん', reading: 'くまるん', englishName: 'Kumarun' };
    return { name: 'キャプテン・クマックス', reading: 'きゃぷてん・くまっくす', englishName: 'Captain KumaX' };
  }

  if (cleanNoun.includes('猫') || cleanNoun.includes('ねこ') || cleanNoun.includes('ネコ')) {
    if (mode === '1-2yo') return { name: 'にゃんぽん', reading: 'にゃんぽん', englishName: 'Nyanpon' };
    if (mode === '3-4yo') return { name: 'ねこりん', reading: 'ねこりん', englishName: 'Nekorin' };
    return { name: 'ナイト・ニャンバルト', reading: 'ないと・にゃんばると', englishName: 'Knight Nyanbalt' };
  }

  if (cleanNoun.includes('パン') || cleanNoun.includes('ドーナツ')) {
    if (mode === '1-2yo') return { name: 'パンぽん', reading: 'ぱんぽん', englishName: 'Panpon' };
    if (mode === '3-4yo') return { name: 'もっちりパンベア', reading: 'もっちりぱんべあ', englishName: 'Mocchuri Pan-Bear' };
    return { name: 'シェフ・パティシエール', reading: 'しぇふ・ぱてぃしえーる', englishName: 'Chef Patissiere' };
  }

  return { name: `${cleanNoun}ちゃん`, reading: `${cleanNoun}ちゃん`, englishName: `${cleanNoun}-chan` };
}

/**
 * 固有名詞から主語動物の英語表現と顔パーツ構造を決定
 */
function getSubjectAnimal(noun: string): { subject: string; ears: string; face: string } {
  const lower = noun.toLowerCase();

  if (lower.includes('車') || lower.includes('くるま') || lower.includes('car') || lower.includes('ベア') || lower.includes('くま') || lower.includes('bear')) {
    return {
      subject: 'adorable cream beige teddy bear mascot character wearing a cute bear hoodie headpiece',
      ears: 'round fluffy beige bear ears with pink inner ears',
      face: 'large sparkling eyes with twin white star dots, blushing pink cheeks, cheerful open mouth'
    };
  } else if (lower.includes('ニワトリ') || lower.includes('にわとり') || lower.includes('ひよこ') || lower.includes('chicken') || lower.includes('rooster')) {
    return {
      subject: 'chubby chick rooster mascot character',
      ears: 'cute soft red feather crest',
      face: 'cheerful chick face with round shiny dot eyes and small yellow beak'
    };
  } else if (lower.includes('猫') || lower.includes('ねこ') || lower.includes('cat')) {
    return {
      subject: 'cute fluffy kitten mascot character',
      ears: 'pointy soft cat ears',
      face: 'adorable cat face with big sparkling eyes and tiny whiskers'
    };
  } else if (lower.includes('恐竜') || lower.includes('dino')) {
    return {
      subject: 'friendly little dinosaur mascot character',
      ears: 'soft rounded dino crest',
      face: 'smiling dino face with big glossy eyes'
    };
  }

  return {
    subject: 'cute mascot character',
    ears: 'cute rounded ears',
    face: 'smiling friendly face with big glossy eyes'
  };
}

interface MotifDetails {
  accessoryEn: string;
  accessoryJp: string;
  colorsEn: string;
  colorsJp: string;
  backgroundDetailsEn: string;
  backgroundDetailsJp: string;
}

/**
 * 固有名詞からモチーフの衣装・小道具・カラーを推論 (日本語/英語 分離構造)
 */
function inferMotifDetails(noun: string): MotifDetails {
  const lower = noun.toLowerCase();

  if (lower.includes('車') || lower.includes('くるま') || lower.includes('car') || lower.includes('バス') || lower.includes('bus')) {
    return {
      accessoryEn: 'standing inside a cute mini light-blue toy car costume around waist with 4 tiny red wheels and a yellow license plate, waving one cute paw',
      accessoryJp: 'お腰に履いた水色のミニカー衣装と小さな赤い車輪',
      colorsEn: 'cream beige, pastel pink, sky blue, ruby red, and yellow',
      colorsJp: 'クリームベージュ・パステルブルー・ルビーレッド',
      backgroundDetailsEn: 'simple plain pastel sky-blue card background with white cloud icons',
      backgroundDetailsJp: 'ふわふわの雲とおもちゃの道路'
    };
  } else if (lower.includes('ニワトリ') || lower.includes('にわとり') || lower.includes('鶏') || lower.includes('ひよこ') || lower.includes('chicken') || lower.includes('rooster')) {
    return {
      accessoryEn: 'a cute soft red crest hat and a tiny egg-shaped felt pouch',
      accessoryJp: '赤いとさか帽子と卵型のフェルトポーチ',
      colorsEn: 'creamy white, bright ruby red, and sunny egg-yolk yellow',
      colorsJp: 'クリーミーホワイト・ルビーレッド・エッグイエロー',
      backgroundDetailsEn: 'chick footprints and golden wheat specks',
      backgroundDetailsJp: 'ひよこの足跡と黄金の麦畑'
    };
  } else if (lower.includes('熊') || lower.includes('くま') || lower.includes('ベア') || lower.includes('bear')) {
    return {
      accessoryEn: 'a cute little honeycomb pouch strap',
      accessoryJp: 'ハチミツ壺の肩掛けポーチ',
      colorsEn: 'warm honey yellow, soft mocha brown, and cream',
      colorsJp: 'ハニーイエロー・モカブラウン・クリーム',
      backgroundDetailsEn: 'acorns and forest berries',
      backgroundDetailsJp: 'どんぐりと森のイチゴ'
    };
  } else if (lower.includes('猫') || lower.includes('ねこ') || lower.includes('ネコ') || lower.includes('cat')) {
    return {
      accessoryEn: 'a tiny golden bell collar and a fish-shaped soft felt badge',
      accessoryJp: '小さな金の鈴首輪とお魚バッジ',
      colorsEn: 'peach pink, milky white, and warm coral',
      colorsJp: 'ピーチピンク・ミルキーホワイト・コーラル',
      backgroundDetailsEn: 'paw prints and yarn balls',
      backgroundDetailsJp: '肉球マークと毛糸玉'
    };
  } else if (lower.includes('パン') || lower.includes('bread') || lower.includes('ドーナツ')) {
    return {
      accessoryEn: 'a melting butter pat mini-hat and a tiny strawberry jam badge',
      accessoryJp: 'とろけるバターのミニ帽子とジャムバッジ',
      colorsEn: 'golden wheat, warm butter yellow, and strawberry red',
      colorsJp: 'こんがりパン色・バターイエロー・イチゴレッド',
      backgroundDetailsEn: 'wheat ears and flour specks',
      backgroundDetailsJp: '小麦の穂とふわふわの小麦粉'
    };
  } else if (lower.includes('恐竜') || lower.includes('dino')) {
    return {
      accessoryEn: 'tiny soft felt back-spikes and an eggshell helmet cup',
      accessoryJp: '背中の小さなトゲトゲと卵のカラ帽子',
      colorsEn: 'mint green, soft lime, and warm buttercup yellow',
      colorsJp: 'ミントグリーン・ライムイエロー',
      backgroundDetailsEn: 'dino footprints and tropical leaf bubbles',
      backgroundDetailsJp: '恐竜の足跡と南国の葉っぱ'
    };
  }

  return {
    accessoryEn: 'a charming custom emblem and matching soft pouch',
    accessoryJp: 'お気に入りのモチーフエンブレムと柔らかいポーチ',
    colorsEn: 'vibrant bright color palette',
    colorsJp: '明るくカラフルなパステルカラー',
    backgroundDetailsEn: 'gentle floating bubbles',
    backgroundDetailsJp: 'やさしいシャボン玉'
  };
}

/**
 * Web UI同等の「LLMプロンプト自動拡張 (Web-UI Grade Prompt Expansion)」
 */
export function enhancePromptForWebUIQuality(rawPrompt: string, style: '2D_Flat' | '3D_Clay' = '2D_Flat'): string {
  if (rawPrompt.startsWith("Sanrio character design style") || rawPrompt.startsWith("masterpiece")) {
    return rawPrompt;
  }

  const prefix = style === '3D_Clay'
    ? "masterpiece, 8k resolution, 3D claymation animation style, handcrafted clay sculpture, vibrant studio lighting, high definition, "
    : "Sanrio character design style, 2D flat vector graphic, official mascot sticker, bold clean thick black outlines, flat solid pastel colors, cel shading, masterpiece, 8k resolution, ";

  const suffix = ", plain solid pastel sky-blue background, high visibility iconic mascot graphic, toddler-friendly vector art.";

  return `${prefix}${rawPrompt}${suffix}`;
}

/**
 * 拡張版 マトリクスプロンプト・ネーミング生成エンジン (Iconic Character Prompt Generator)
 */
export function generateMatrixCharacter(
  targetAge: number,
  properNoun: string,
  renderStyle: '2D_Flat' | '3D_Clay' = '2D_Flat'
): GenerationResult {
  const xWeight = calculateXWeight(targetAge);
  const designMode = determineDesignMode(xWeight);
  const vectorParams = getVectorParameters(xWeight);

  const noun = properNoun.trim() || '車';
  const motifInfo = inferMotifDetails(noun);
  const namingInfo = generateCreativeName(noun, designMode);
  const subjectInfo = getSubjectAnimal(noun);

  let worldView = '';
  let storyRole = '';
  let mainPrompt = '';
  let turnaroundPrompt = '';
  let negativePrompt = '';

  const name = namingInfo.name;
  const reading = namingInfo.reading;
  const englishName = namingInfo.englishName;

  if (designMode === '1-2yo') {
    worldView = `まるくて柔らかい仲間たちが集まる「ぽよぽよパーク」。${name}は${motifInfo.accessoryJp}をお気に入りに身につけ、ぽよぽよお散歩とお昼寝が大好き。`;
    storyRole = `乳幼児を癒す赤ちゃんのお友達。触るとモチモチ揺れて、${motifInfo.backgroundDetailsJp}と一緒にみんなを笑顔にします。`;

    mainPrompt = `Sanrio character design style, 2D flat vector graphic, official mascot sticker, bold clean thick black outlines, flat solid pastel colors, cel shading, masterpiece, 8k resolution. A cute 2D vector mascot character named ${englishName} (${name}), 1.2 head-to-body ratio, ${subjectInfo.subject}, ${subjectInfo.ears}, ${subjectInfo.face}. ${motifInfo.accessoryEn}. Palette in ${motifInfo.colorsEn}, plain solid pastel sky-blue background.`;

    turnaroundPrompt = `Character design turnaround sheet of ${englishName} (${name}), 3 distinct views: front view, side profile view, full back view. 1.2 head-to-body ratio spherical ${subjectInfo.subject} wearing ${motifInfo.accessoryEn}. Full body standing, isolated on clean white background, ultra-thick outlines, exact vector art style, consistent proportions across all 3 views.`;

    negativePrompt = `abstract, mechanical, robot, complex machinery, gear, blurry, lowres, distorted anatomy, realistic photo, 3d render, plush toy, soft focus, dark background, noise, blown out, gradients, shadows`;

  } else if (designMode === '3-4yo') {
    worldView = `おもちゃと仲間たちが集まる「わくわく広場」。${name}は${motifInfo.accessoryJp}を大切に身につけて、みんなで楽しくごっこ遊びをしています。`;
    storyRole = `ごっこ遊びの案内役。${motifInfo.colorsJp}をまとったキュートなスタイルで、困難もみんなで解決する人気者。`;

    mainPrompt = `Sanrio character design style, 2D flat vector graphic, official mascot sticker, bold clean thick black outlines, flat solid pastel colors, cel shading, masterpiece, 8k resolution. A cute 2D vector mascot character named ${englishName} (${name}), 1.8 head-to-body ratio, ${subjectInfo.subject}, ${subjectInfo.ears}, ${subjectInfo.face}. ${motifInfo.accessoryEn}. Palette in ${motifInfo.colorsEn}, plain solid pastel sky-blue background.`;

    turnaroundPrompt = `Character design turnaround sheet of ${englishName} (${name}), 3 distinct views: front view, side profile view, full back view. 1.8 head-to-body ratio ${subjectInfo.subject} with short cute limbs, ${motifInfo.accessoryEn}. Full body standing, isolated on clean white background, bold clean outlines, picture book vector style, consistent features across all 3 views.`;

    negativePrompt = `abstract, mechanical, robot, complex machinery, gear, blurry, lowres, distorted anatomy, realistic photo, 3d render, plush toy, soft focus, dark background, noise, blown out, gradients, shadows`;

  } else {
    worldView = `冒険と夢が詰まった「ヒーローアイランド」。${name}は${motifInfo.accessoryJp}をシンボルに掲げ、仲間を守るため元気に活躍中！`;
    storyRole = `元気いっぱいのリーダー。${motifInfo.colorsJp}のヒーロー衣装を着こなし、どんなチャレンジも笑顔とジャンプで乗り越えます。`;

    mainPrompt = `Sanrio anime mascot style, 2D flat vector graphic, official mascot sticker, bold clean sharp black outlines, flat solid colors, high-contrast iconic vector graphic, masterpiece, 8k resolution. An energetic heroic 2D vector mascot character named ${englishName} (${name}), 2.5 head-to-body ratio, ${subjectInfo.subject}, ${subjectInfo.ears}, ${subjectInfo.face}, heroic pose, ${motifInfo.accessoryEn}. Palette in ${motifInfo.colorsEn}, plain solid pastel background.`;

    turnaroundPrompt = `Character design turnaround sheet of ${englishName} (${name}), 3 distinct views: front view, side profile view, full back view. 2.5 head-to-body ratio ${subjectInfo.subject} hero character with cape and ${motifInfo.accessoryEn}. Full body standing, isolated on clean white background, clean sharp outlines, anime vector style across all 3 views.`;

    negativePrompt = `abstract, mechanical, robot, complex machinery, gear, blurry, lowres, distorted anatomy, realistic photo, 3d render, plush toy, soft focus, dark background, noise, blown out, gradients, shadows`;
  }

  const enhancedMainPrompt = enhancePromptForWebUIQuality(mainPrompt, renderStyle);

  return {
    matrix_status: {
      target_age: targetAge,
      x_weight_percent: xWeight,
      design_mode: designMode,
      render_style: renderStyle
    },
    vector_parameters: vectorParams,
    character_profile: {
      name,
      reading,
      proper_noun: noun,
      world_view: worldView,
      story_role: storyRole
    },
    ai_prompts: {
      main_visual: enhancedMainPrompt,
      turnaround_sheet: turnaroundPrompt,
      negative_prompt: negativePrompt
    }
  };
}

/**
 * 自然言語入力（例: 「4歳向け 熊」「車ベア」「1歳向け パン」）から、対象年齢・固有名詞・レンダー表現をパース
 */
export function parseNaturalLanguageInput(input: string): { age: number; noun: string; renderStyle: RenderStyle } {
  let age = 3.5;
  let renderStyle: RenderStyle = '2D_Flat';

  if (input.includes('3D') || input.includes('粘土') || input.includes('クレイ')) {
    renderStyle = '3D_Clay';
  }

  const ageMatch = input.match(/(\d(?:\.\d)?)\s*(?:歳|才|yo)/i);
  if (ageMatch) {
    age = parseFloat(ageMatch[1]);
  }

  let noun = input;

  // Extract quotes if present e.g. 「車」
  const quoteMatch = input.match(/[「『"']([^」』"']+)[\v」』"']/);
  if (quoteMatch && quoteMatch[1]) {
    noun = quoteMatch[1];
  } else {
    noun = noun
      .replace(/(\d(?:\.\d)?)\s*(?:歳|才|yo|向け)/gi, '')
      .replace(/に|を|が|の/g, ' ')
      .replace(/テーマ|親しみやすい|キャラクター|デザイン|マスコット|作成|して|作って|お願い|イラスト|画像|生成/g, '')
      .trim();
  }

  noun = noun.replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '').trim();

  if (!noun || noun.length > 10) {
    if (input.includes('車') || input.includes('くるま') || input.includes('car')) noun = '車';
    else if (input.includes('猫') || input.includes('ねこ') || input.includes('cat')) noun = '猫';
    else if (input.includes('パン')) noun = 'パン';
    else noun = '車';
  }

  return { age, noun, renderStyle };
}
