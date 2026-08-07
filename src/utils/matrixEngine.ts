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
 * LLMの自由な直感的発想（Motif-Free & Concept-Inspired LLM Naming Synthesizer）
 * モチーフ単語そのものを使ってもいいし、使わずに音感・世界観のひらめきで命名してもOKな真の自由度エンジン
 */
function generateCreativeName(noun: string, mode: DesignMode): { name: string; reading: string; englishName: string } {
  const cleanNoun = noun.replace(/(向け|歳|才|モード)/g, '').trim() || 'マスコット';

  // 1-2歳: 単語使用パターン + 音感ひらめき非使用パターン
  const llmIntuition_1_2yo = [
    `${cleanNoun}ぽん`, `ぽよりん${cleanNoun}`, `${cleanNoun}ぷりん`, `もちもち${cleanNoun}`,
    'ぽよまる', 'ぷにぽん', 'もこたん', 'ころりん', 'ぷよりん', 'ぽてぽて', 'ふわまる', 'ぴよぽん'
  ];

  // 3-4歳: 単語使用パターン + 音感ひらめき非使用パターン
  const llmIntuition_3_4yo = [
    `${cleanNoun}りん`, `${cleanNoun}っち`, `てちてち${cleanNoun}`, `${cleanNoun}ぽんた`,
    'ぽよりん王子', 'てちてちまる', 'わくわくっち', 'ぴょんきち', 'もっちりすけ', 'るんるん丸', 'ぽんたろう'
  ];

  // 5-6歳: 単語使用パターン + 音感ひらめき非使用パターン
  const llmIntuition_5_6yo = [
    `キャプテン・${cleanNoun}`, `キング・${cleanNoun}`, `ナイト・${cleanNoun}`, `${cleanNoun}マックス`,
    'キャプテン・ポヨン', 'キング・モコ', 'ハイパー・ピョン', 'ナイト・ガブ', 'メガ・コロ', 'DXウルトラ丸'
  ];

  let chosenName = '';
  if (mode === '1-2yo') {
    chosenName = llmIntuition_1_2yo[Math.floor(Math.random() * llmIntuition_1_2yo.length)];
  } else if (mode === '3-4yo') {
    chosenName = llmIntuition_3_4yo[Math.floor(Math.random() * llmIntuition_3_4yo.length)];
  } else {
    chosenName = llmIntuition_5_6yo[Math.floor(Math.random() * llmIntuition_5_6yo.length)];
  }

  return {
    name: chosenName,
    reading: chosenName,
    englishName: `${cleanNoun} Mascot`
  };
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

  const cleanNoun = properNoun.replace(/(向け|歳|才|モード)/g, '').trim() || 'マスコット';

  // 年齢モードに応じた体型・線・造形ガイドラインの定義
  let ageStyleGuide = '';
  if (designMode === '1-2yo') {
    ageStyleGuide = 'ultra simple round body, 1.2 head-to-body ratio, ultra-thick black outline, pastel colors';
  } else if (designMode === '3-4yo') {
    ageStyleGuide = 'adorable rounded proportion, 1.8 head-to-body ratio, thick clean black outline, pastel palette';
  } else {
    ageStyleGuide = 'cute proportions, 2.2 head-to-body ratio, clean black outline, bright pastel colors';
  }

  // 余計な缶バッジ・カバン・テキストロゴ等を一切排除した「純粋マスコット単体」プロンプト
  const mainVisualPrompt = renderStyle === '3D_Clay'
    ? `masterpiece, 8k resolution, 3D claymation style, single standalone cute ${cleanNoun} mascot character, centered, full body, ${ageStyleGuide}, plain solid background, high quality`
    : `Sanrio character design style, 2D flat vector graphic, official mascot sticker, bold clean thick black outlines, flat solid pastel colors, single standalone cute ${cleanNoun} mascot character, centered, full body, ${ageStyleGuide}, plain solid pastel background, high visibility iconic mascot graphic, toddler-friendly vector art`;
  const negativePrompt = 'realistic, 3d render, complex background, text, watermark, logo, badge, bag, extra objects, multiple characters, blurry, lowres, soft focus, distorted anatomy';

  const namingInfo = generateCreativeName(cleanNoun, designMode);

  return {
    matrix_status: {
      target_age: targetAge,
      x_weight_percent: xWeight,
      design_mode: designMode,
      render_style: renderStyle
    },
    vector_parameters: vectorParams,
    character_profile: {
      name: namingInfo.name,
      reading: namingInfo.reading,
      proper_noun: cleanNoun,
      world_view: `ターゲット「${targetAge}歳 × ${cleanNoun}」向けマスコット。`,
      story_role: `主役マスコット`
    },
    ai_prompts: {
      main_visual: mainVisualPrompt,
      turnaround_sheet: '',
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
