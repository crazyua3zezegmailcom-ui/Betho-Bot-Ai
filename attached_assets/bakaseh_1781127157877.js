/**
 * ═══════════════════════════════════════════════════════
 *              🎭 لعبة بكاسه - WhatsApp Bot
 *         لعبة الكلمة السرية والبرا المتخفي
 * ═══════════════════════════════════════════════════════
 */

// ─── حالة الألعاب النشطة لكل جروب ───
const bakaseh_games = new Map();

// ─── ثوابت اللعبة ───
const JOIN_TIME       = 30 * 1000;        // 30 ثانية انضمام
const DISCUSSION_TIME = 3 * 60 * 1000;   // 3 دقائق نقاش
const VOTE_TIME       = 60 * 1000;        // 60 ثانية تصويت
const GUESS_TIME      = 30 * 1000;        // 30 ثانية للتخمين
const MIN_PLAYERS     = 3;
const MAX_PLAYERS     = 15;

// ═══════════════════════════════════════════════════════
//                    📚 بنك الكلمات
// ═══════════════════════════════════════════════════════
const WORD_BANK = {
  أكلات: [
    'بيتزا', 'شاورما', 'برجر', 'سشي', 'باستا', 'تاكو', 'فلافل',
    'كشري', 'مندي', 'كبسة', 'مشاوي', 'فطير', 'كنافة', 'بسبوسة',
    'ملوخية', 'فول', 'طعمية', 'كوشري', 'هامبرغر', 'لازانيا',
    'ستيك', 'دجاج مشوي', 'أرز بالشعرية', 'شوربة عدس', 'مسخن'
  ],
  حيوانات: [
    'أسد', 'نمر', 'فيل', 'زرافة', 'حصان', 'دلفين', 'خروف',
    'قرد', 'ببغاء', 'تمساح', 'ضفدع', 'أرنب', 'ثعلب', 'ذئب',
    'دب', 'بطريق', 'كنغر', 'فهد', 'وحيد القرن', 'حوت', 'قنديل البحر',
    'عقرب', 'صقر', 'طاووس', 'حمار وحشي'
  ],
  أفلام: [
    'أفاتار', 'تيتانيك', 'إنتارستيلار', 'الجوكر', 'أراضي الفضاء',
    'سبايدر مان', 'الأسد الملك', 'آلاء الدين', 'موانا', 'إنكانتو',
    'إنسبشن', 'ماتريكس', 'جوراسيك بارك', 'هاري بوتر', 'ستار وورز',
    'شريك', 'ميني', 'أيس ايج', 'كارز', 'توي ستوري', 'أنتمان',
    'ثور', 'آيرون مان', 'كابتن أمريكا', 'الرجل النملة'
  ],
  مسلسلات: [
    'لعبة العروش', 'مانيفستو', 'لوسيفر', 'ويتشر', 'سترانجر ثينجز',
    'بريكينج باد', 'مانداليوريان', 'هاوس أوف ذا دراغون', 'الورقة',
    'ذا بوز', 'سكويد جيم', 'ألتر إيغو', 'هانيبال', 'ميندهانتر',
    'أوزارك', 'بيكي بلايندرز', 'فريندز', 'البيت الكبير', 'نيتفليكس'
  ],
  أنمي: [
    'ناروتو', 'دراغون بول', 'ون بيس', 'هجوم العمالقة', 'ديمون سلاير',
    'ماي هيرو اكاديميا', 'فولميتال', 'ديث نوت', 'هانتر هانتر',
    'بليتش', 'فيري تيل', 'ساو', 'توكيو غول', 'فينلاند ساغا',
    'فريرن', 'جوجوتسو كايسن', 'شينبي', 'ديانا', 'بوروتو'
  ],
  دول: [
    'مصر', 'السعودية', 'اليابان', 'البرازيل', 'كندا', 'أستراليا',
    'المكسيك', 'الهند', 'تركيا', 'إيطاليا', 'فرنسا', 'إسبانيا',
    'ألمانيا', 'كوريا', 'الإمارات', 'المغرب', 'نيجيريا', 'جنوب أفريقيا',
    'أرجنتين', 'كولومبيا', 'تايلاند', 'سنغافورة', 'بولندا', 'هولندا'
  ],
  مشاهير: [
    'محمد صلاح', 'كريستيانو رونالدو', 'ليونيل ميسي', 'إيلون ماسك',
    'ويل سميث', 'ليوناردو ديكابريو', 'أنجلينا جولي', 'بيونسيه',
    'دريك', 'أيمي واينهاوس', 'ريانا', 'تايلور سويفت', 'بيل غيتس',
    'ستيف جوبز', 'مارك زوكربيرغ', 'عمرو دياب', 'محمد رمضان',
    'أحمد مكي', 'هاني شاكر', 'تامر حسني', 'نجوى كرم', 'أنغام'
  ],
  ألعاب: [
    'فورتنايت', 'ماينكرافت', 'جي تي إيه', 'فيفا', 'بابجي',
    'فري فاير', 'كول أوف ديوتي', 'أمونج أس', 'ليغ أوف ليجيندز',
    'فالورانت', 'أبيكس', 'رينبو سيكس', 'ووراكرافت', 'ديابلو',
    'إيلدن رينج', 'سايبربانك', 'ريد ديد', 'ذا لاست أوف أس', 'جود أوف وور'
  ],
  تطبيقات: [
    'واتساب', 'تيك توك', 'إنستغرام', 'سناب شات', 'تويتر',
    'يوتيوب', 'نتفليكس', 'سبوتيفاي', 'أمازون', 'أوبر',
    'كريم', 'تالابات', 'جوجل ماب', 'زووم', 'تيليغرام',
    'ديسكورد', 'ريديت', 'لينكدإن', 'بينترست', 'تامبلر'
  ],
  شخصيات_كرتون: [
    'سبونج بوب', 'باتمان', 'سبايدر مان', 'سوبر مان', 'ميكي ماوس',
    'توم وجيري', 'باغز باني', 'شخصية دورا', 'نارنيا', 'أيونيك',
    'مرفي', 'ستيفن', 'جريفن', 'سيمبسون', 'ريك ومورتي',
    'بوباي', 'كابتن ماجد', 'أوباما', 'سندريلا', 'سنو وايت'
  ],
  جماد: [
    'ثلاجة', 'تلفزيون', 'موبايل', 'كمبيوتر', 'سيارة',
    'دراجة', 'ساعة', 'حقيبة', 'كرسي', 'مكتب', 'نافذة',
    'مرآة', 'مصباح', 'كتاب', 'قلم', 'مقص', 'بطارية',
    'كاميرا', 'ميكروفون', 'سماعات', 'طابعة', 'راوتر', 'ريموت'
  ]
};

// ─── اختيار كلمة عشوائية مع فئتها ───
function getRandomWord() {
  const categories = Object.keys(WORD_BANK);
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const words = WORD_BANK[cat];
  const word = words[Math.floor(Math.random() * words.length)];
  return { word, category: cat };
}

// ─── اختيار 3 كلمات خاطئة مشابهة لنفس الفئة ───
function getDecoyWords(word, category) {
  const words = WORD_BANK[category].filter(w => w !== word);
  const shuffled = words.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// ─── إنشاء حالة لعبة جديدة ───
function newBakasehGame() {
  return {
    phase: 'joining',          // joining | playing | voting | final_guess | ended
    players: [],               // JIDs المشاركين
    barra: null,               // JID اللاعب البرا
    secretWord: null,
    category: null,
    joinTimer: null,
    discussTimer: null,
    voteTimer: null,
    guessTimer: null,
    votes: {},                 // { voterJid: targetJid }
    guessChoices: [],          // الخيارات الأربعة
    messageIds: []             // IDs للرسائل المهمة
  };
}

// ─── الحصول على اسم اللاعب ───
function getPlayerName(conn, jid) {
  try {
    const contact = conn.contacts?.[jid];
    return contact?.pushname || contact?.name || jid.split('@')[0];
  } catch {
    return jid.split('@')[0];
  }
}

// ─── إيقاف كل التايمرات ───
function clearAllTimers(game) {
  ['joinTimer', 'discussTimer', 'voteTimer', 'guessTimer'].forEach(t => {
    if (game[t]) { clearTimeout(game[t]); game[t] = null; }
  });
}

// ─── إرسال خاص مع تجاهل الخطأ ───
async function sendPrivate(conn, jid, text) {
  try {
    await conn.sendMessage(jid, { text });
    return true;
  } catch {
    return false;
  }
}

// ─── بناء قائمة اللاعبين ───
function buildPlayerList(conn, game) {
  return game.players
    .map((jid, i) => `${i + 1}. @${jid.split('@')[0]}`)
    .join('\n');
}

// ═══════════════════════════════════════════════════════
//           مرحلة بدء التصويت
// ═══════════════════════════════════════════════════════
async function startVotingPhase(conn, chatId, game) {
  clearAllTimers(game);
  game.phase = 'voting';
  game.votes = {};

  const playerList = buildPlayerList(conn, game);
  const mentions   = [...game.players];

  let msg = `🗳 *وقت التصويت!*\n\n`;
  msg += `من تتوقع أنه *البرا*؟ 🕵\n\n`;
  msg += `👥 *اللاعبون:*\n${playerList}\n\n`;
  msg += `📩 صوّت بمنشن الشخص أو رقمه\n`;
  msg += `⏳ وقت التصويت: 60 ثانية`;

  await conn.sendMessage(chatId, { text: msg, mentions });

  game.voteTimer = setTimeout(async () => {
    if (!bakaseh_games.has(chatId)) return;
    const g = bakaseh_games.get(chatId);
    if (g.phase !== 'voting') return;
    await revealResult(conn, chatId, g);
  }, VOTE_TIME);
}

// ═══════════════════════════════════════════════════════
//           كشف النتيجة بعد التصويت
// ═══════════════════════════════════════════════════════
async function revealResult(conn, chatId, game) {
  clearAllTimers(game);

  // ─── احسب الأصوات ───
  const tally = {};
  for (const target of Object.values(game.votes)) {
    tally[target] = (tally[target] || 0) + 1;
  }

  // ─── من حصل على أعلى تصويت ───
  let suspected = null;
  let maxVotes  = 0;
  for (const [jid, count] of Object.entries(tally)) {
    if (count > maxVotes) { maxVotes = count; suspected = jid; }
  }

  if (!suspected) {
    // لا أحد صوّت
    await conn.sendMessage(chatId, {
      text: `😑 *لا أحد صوّت!*\n\n😈 البرا نجا بدون تصويت!\n\n🏆 *الفائز:* @${game.barra.split('@')[0]}`,
      mentions: [game.barra]
    });
    await endGame(conn, chatId, game, 'barra_wins');
    return;
  }

  const isCaught = suspected === game.barra;

  if (isCaught) {
    // ─── البرا اتكشف ← أعطه فرصة أخيرة ───
    const suspectedName = suspected.split('@')[0];
    await conn.sendMessage(chatId, {
      text: `🎉 *تم كشف اللاعب البرا!*\n\n😱 اللاعب: @${suspectedName}\nحصل على *${maxVotes}* أصوات\n\n🧠 نعطيه فرصة أخيرة لتخمين الكلمة...`,
      mentions: [suspected]
    });
    await sendFinalGuess(conn, chatId, game);
  } else {
    // ─── البرا ما اتكشفش ───
    const realBarraName = game.barra.split('@')[0];
    await conn.sendMessage(chatId, {
      text: `😈 *لم يتم كشف اللاعب البرا!*\n\n🏆 *الفائز:* @${realBarraName}\n📌 *الكلمة كانت:* ${game.secretWord}`,
      mentions: [game.barra]
    });
    await endGame(conn, chatId, game, 'barra_wins');
  }
}

// ═══════════════════════════════════════════════════════
//           الفرصة الأخيرة للاعب البرا
// ═══════════════════════════════════════════════════════
async function sendFinalGuess(conn, chatId, game) {
  game.phase = 'final_guess';

  const decoys  = getDecoyWords(game.secretWord, game.category);
  const choices = [game.secretWord, ...decoys].sort(() => Math.random() - 0.5);
  game.guessChoices = choices;

  const choicesText = choices.map((c, i) => `${i + 1}- ${c}`).join('\n');

  // أرسل في الخاص للبرا
  const privMsg =
    `🧠 *فرصة أخيرة!*\n\n` +
    `حاول تخمن الكلمة الصحيحة للفوز 🏆\n\n` +
    `اختر من الخيارات:\n\n${choicesText}\n\n` +
    `📩 ارسل رقم اختيارك في الجروب`;

  await sendPrivate(conn, game.barra, privMsg);

  // أرسل في الجروب الخيارات بدون الكلمة الصحيحة
  await conn.sendMessage(chatId, {
    text: `🎯 *الفرصة الأخيرة للاعب البرا!*\n\n📩 تم إرسال الخيارات في الخاص\n⏳ عنده 30 ثانية للرد هنا برقم اختياره`,
    mentions: [game.barra]
  });

  game.guessTimer = setTimeout(async () => {
    if (!bakaseh_games.has(chatId)) return;
    const g = bakaseh_games.get(chatId);
    if (g.phase !== 'final_guess') return;

    await conn.sendMessage(chatId, {
      text: `⌛ *انتهى وقت التخمين!*\n\n❌ البرا لم يرد في الوقت\n\n🏆 *فازت المجموعة!*\n📌 *الكلمة كانت:* ${g.secretWord}`
    });
    await endGame(conn, chatId, g, 'group_wins');
  }, GUESS_TIME);
}

// ═══════════════════════════════════════════════════════
//           إنهاء اللعبة
// ═══════════════════════════════════════════════════════
async function endGame(conn, chatId, game, result) {
  clearAllTimers(game);
  game.phase = 'ended';

  let endMsg = `🎭 *انتهت الجولة!*\n\n`;

  if (result === 'barra_wins') {
    endMsg += `😈 *البرا فاز!*\n`;
    endMsg += `🏆 @${game.barra.split('@')[0]} نجح في التخفي\n\n`;
  } else if (result === 'group_wins') {
    endMsg += `🎉 *المجموعة فازت!*\n`;
    endMsg += `البرا @${game.barra.split('@')[0]} اتكشف\n\n`;
  } else if (result === 'barra_guessed') {
    endMsg += `🤯 *البرا عرف الكلمة وفاز!*\n`;
    endMsg += `🏆 @${game.barra.split('@')[0]} ذكي جداً!\n\n`;
  }

  endMsg += `📌 *الكلمة كانت:* ${game.secretWord} (${game.category})\n\n`;
  endMsg += `شكراً للعب ❤️\nاكتب *.بكاسه* لبدء جولة جديدة`;

  await conn.sendMessage(chatId, {
    text: endMsg,
    mentions: [game.barra]
  });

  bakaseh_games.delete(chatId);
}

// ═══════════════════════════════════════════════════════
//                    الهاندلر الرئيسي
// ═══════════════════════════════════════════════════════
let handler = async (m, { conn }) => {
  const chatId   = m.chat;
  const senderId = m.sender;
  const body     = (m.body || '').trim();

  if (!chatId.endsWith('@g.us')) {
    return conn.sendMessage(chatId, { text: '🚫 هذه اللعبة للجروبات فقط!' });
  }

  // ─── أمر البدء ───
  if (/^\.بكاسه$/i.test(body)) {

    if (bakaseh_games.has(chatId)) {
      return conn.sendMessage(chatId, {
        text: '⚠️ في لعبة شغالة دلوقتي!\nاكتب *.إيقاف بكاسه* لإلغائها'
      });
    }

    const game = newBakasehGame();
    bakaseh_games.set(chatId, game);

    // ─── رسالة الانضمام ───
    let joinMsg = `🎭 *لعبة بكاسه بدأت!*\n\n`;
    joinMsg += `اكتب *انضمام* للمشاركة 🎮\n\n`;
    joinMsg += `⏳ مدة الانضمام: 30 ثانية\n`;
    joinMsg += `👥 الحد الأدنى: ${MIN_PLAYERS} لاعبين\n`;
    joinMsg += `👥 الحد الأقصى: ${MAX_PLAYERS} لاعب`;

    await conn.sendMessage(chatId, { text: joinMsg });

    // ─── تايمر إغلاق الانضمام ───
    game.joinTimer = setTimeout(async () => {
      if (!bakaseh_games.has(chatId)) return;
      const g = bakaseh_games.get(chatId);
      if (g.phase !== 'joining') return;

      if (g.players.length < MIN_PLAYERS) {
        await conn.sendMessage(chatId, {
          text: `❌ *انتهى وقت الانضمام*\n\nعدد اللاعبين ${g.players.length} أقل من المطلوب (${MIN_PLAYERS})\n\nاكتب *.بكاسه* لتحاول مرة ثانية`
        });
        bakaseh_games.delete(chatId);
        return;
      }

      await startGame(conn, chatId, g);
    }, JOIN_TIME);

    return;
  }

  // ─── أمر الإيقاف ───
  if (/^\.إيقاف بكاسه$/i.test(body)) {
    if (bakaseh_games.has(chatId)) {
      const g = bakaseh_games.get(chatId);
      clearAllTimers(g);
      bakaseh_games.delete(chatId);
      return conn.sendMessage(chatId, { text: '🛑 *تم إيقاف لعبة بكاسه*' });
    }
    return conn.sendMessage(chatId, { text: '⚠️ لا توجد لعبة نشطة.' });
  }

  // ─── تحقق من وجود لعبة نشطة ───
  if (!bakaseh_games.has(chatId)) return;
  const game = bakaseh_games.get(chatId);

  // ════════════════════════════════════════
  //         مرحلة الانضمام
  // ════════════════════════════════════════
  if (game.phase === 'joining' && /^انضمام$/i.test(body)) {
    if (game.players.includes(senderId)) {
      return conn.sendMessage(chatId, {
        text: `⚠️ @${senderId.split('@')[0]} أنت مسجل بالفعل!`,
        mentions: [senderId]
      });
    }

    if (game.players.length >= MAX_PLAYERS) {
      return conn.sendMessage(chatId, { text: '🚫 الغرفة ممتلئة!' });
    }

    game.players.push(senderId);
    const count = game.players.length;

    await conn.sendMessage(chatId, {
      text: `✅ @${senderId.split('@')[0]} انضم!\n👥 اللاعبون الآن: ${count}/${MAX_PLAYERS}`,
      mentions: [senderId]
    });

    // ─── إذا اكتملت اللاعبين الأقصى ابدأ فوراً ───
    if (count === MAX_PLAYERS) {
      clearAllTimers(game);
      await startGame(conn, chatId, game);
    }

    return;
  }

  // ════════════════════════════════════════
  //         مرحلة التصويت
  // ════════════════════════════════════════
  if (game.phase === 'voting') {
    if (!game.players.includes(senderId)) return;
    if (game.votes[senderId]) return; // صوّت قبل كده

    let targetJid = null;

    // ─── صوّت برقم اللاعب ───
    const numMatch = body.match(/^(\d+)$/);
    if (numMatch) {
      const idx = parseInt(numMatch[1]) - 1;
      if (idx >= 0 && idx < game.players.length) {
        targetJid = game.players[idx];
      }
    }

    // ─── صوّت بمنشن ───
    if (!targetJid && m.mentionedJid?.length > 0) {
      const mentioned = m.mentionedJid[0];
      if (game.players.includes(mentioned)) {
        targetJid = mentioned;
      }
    }

    if (!targetJid) return;

    if (targetJid === senderId) {
      return conn.sendMessage(chatId, {
        text: `😅 @${senderId.split('@')[0]} ما تقدرش تصوّت على نفسك!`,
        mentions: [senderId]
      });
    }

    game.votes[senderId] = targetJid;
    const voterName  = senderId.split('@')[0];
    const targetName = targetJid.split('@')[0];
    const votedCount = Object.keys(game.votes).length;
    const totalVoters = game.players.length;

    await conn.sendMessage(chatId, {
      text: `🗳 @${voterName} صوّت ضد @${targetName}\n📊 الأصوات: ${votedCount}/${totalVoters}`,
      mentions: [senderId, targetJid]
    });

    // ─── لو كل الكل صوّت انهي التصويت فوراً ───
    if (votedCount >= totalVoters) {
      clearAllTimers(game);
      await revealResult(conn, chatId, game);
    }

    return;
  }

  // ════════════════════════════════════════
  //         مرحلة التخمين الأخير
  // ════════════════════════════════════════
  if (game.phase === 'final_guess' && senderId === game.barra) {
    const numMatch = body.match(/^([1-4])$/);
    if (!numMatch) return;

    const choiceIdx = parseInt(numMatch[1]) - 1;
    const chosen    = game.guessChoices[choiceIdx];

    clearAllTimers(game);

    if (chosen === game.secretWord) {
      await conn.sendMessage(chatId, {
        text: `😱 *اللاعب البرا عرف الكلمة!*\n\n🏆 *فاز اللاعب البرا!*\n@${game.barra.split('@')[0]} اختار: *${chosen}* ✅`,
        mentions: [game.barra]
      });
      await endGame(conn, chatId, game, 'barra_guessed');
    } else {
      await conn.sendMessage(chatId, {
        text: `❌ *اللاعب البرا فشل في التخمين!*\n\naختار: *${chosen}* ❌\n\n🏆 *فازت المجموعة!*\n📌 *الكلمة الصحيحة كانت:* ${game.secretWord}`,
        mentions: [game.barra]
      });
      await endGame(conn, chatId, game, 'group_wins');
    }

    return;
  }

  // ════════════════════════════════════════
  //     مرحلة النقاش — مراقبة الكلمة السرية
  // ════════════════════════════════════════
  if (game.phase === 'playing' && game.secretWord) {
    const lowerBody = body.toLowerCase();
    const lowerWord = game.secretWord.toLowerCase();

    if (lowerBody.includes(lowerWord) && game.players.includes(senderId)) {
      try {
        await conn.sendMessage(chatId, {
          text: `🚫 *ممنوع كشف الكلمة!*\n@${senderId.split('@')[0]}`,
          mentions: [senderId]
        });
      } catch {}
    }
  }
};

// ═══════════════════════════════════════════════════════
//           تشغيل اللعبة الفعلي بعد الانضمام
// ═══════════════════════════════════════════════════════
async function startGame(conn, chatId, game) {
  clearAllTimers(game);
  game.phase = 'playing';

  // ─── اختر كلمة عشوائية ───
  const { word, category } = getRandomWord();
  game.secretWord = word;
  game.category   = category;

  // ─── اختر البرا عشوائياً ───
  const barraIdx = Math.floor(Math.random() * game.players.length);
  game.barra = game.players[barraIdx];

  // ─── رسالة في الجروب ───
  const allMentions = [...game.players];
  let startMsg = `\n🔥 *استعدوا يا عصابة!*\n*البرا بينكم* 😈\n\n`;
  startMsg += `👥 *اللاعبون:*\n${buildPlayerList(conn, game)}\n\n`;
  startMsg += `📩 تم إرسال الكلمة في الخاص لكل لاعب\n`;
  startMsg += `━━━━━━━━━━━━━━━━━━━━\n`;
  startMsg += `🎮 *بدأت الجولة!*\n\n`;
  startMsg += `🗣 كل لاعب يسأل لاعب آخر سؤال واحد\n`;
  startMsg += `🚫 ممنوع قول الكلمة مباشرة\n`;
  startMsg += `🚫 ممنوع الغش أو إرسال صور\n`;
  startMsg += `⏳ وقت النقاش: 3 دقائق`;

  await conn.sendMessage(chatId, { text: startMsg, mentions: allMentions });

  // ─── أرسل للاعبين العاديين ───
  let failedPlayers = [];
  for (const jid of game.players) {
    if (jid === game.barra) continue;

    const sent = await sendPrivate(conn, jid, 
      `🎭 *لعبة بكاسه*\n\n` +
      `📌 *الكلمة السرية:* (${category})\n\n` +
      `🔤 *${word}*\n\n` +
      `🕵 *مهمتك:*\n` +
      `حاول تعرف مين اللاعب البرا\n` +
      `بدون ما تفضح الكلمة 😏`
    );

    if (!sent) failedPlayers.push(jid);
  }

  // ─── أرسل للبرا ───
  const barraSent = await sendPrivate(conn, game.barra,
    `🚨 *أنت البرا!* 🚨\n\n` +
    `😶 أنت *لا تعرف* الكلمة السرية\n\n` +
    `🎭 *مهمتك:*\nحاول تندمج بالكلام والأسئلة\n` +
    `بدون ما ينكشف أمرك 🤫\n\n` +
    `⚠️ إذا انكشفت هيعطوك فرصة أخيرة للتخمين!`
  );

  if (!barraSent) failedPlayers.push(game.barra);

  // ─── إذا في لاعبين ما قدرناش نراسلهم ───
  if (failedPlayers.length > 0) {
    const names = failedPlayers.map(j => '@' + j.split('@')[0]).join(', ');
    await conn.sendMessage(chatId, {
      text: `⚠️ لم يتمكن البوت من إرسال الخاص لـ ${names}\nتأكد إنهم فتحوا الخاص مع البوت ← سيتم استبعادهم`,
      mentions: failedPlayers
    });
    // استبعد اللاعبين اللي ما ردوش
    game.players = game.players.filter(j => !failedPlayers.includes(j));
    if (game.players.length < MIN_PLAYERS) {
      await conn.sendMessage(chatId, { text: '❌ *عدد اللاعبين غير كافٍ بعد الاستبعاد. انتهت اللعبة.*' });
      bakaseh_games.delete(chatId);
      return;
    }
  }

  // ─── تايمر انتهاء النقاش ───
  game.discussTimer = setTimeout(async () => {
    if (!bakaseh_games.has(chatId)) return;
    const g = bakaseh_games.get(chatId);
    if (g.phase !== 'playing') return;

    await conn.sendMessage(chatId, { text: '⏰ *انتهى وقت النقاش!*\nنروح للتصويت...' });
    await startVotingPhase(conn, chatId, g);
  }, DISCUSSION_TIME);

  // ─── تنبيه 60 ثانية قبل انتهاء النقاش ───
  setTimeout(async () => {
    if (!bakaseh_games.has(chatId)) return;
    const g = bakaseh_games.get(chatId);
    if (g.phase !== 'playing') return;
    await conn.sendMessage(chatId, { text: '⏳ *باقي 60 ثانية على التصويت!*' });
  }, DISCUSSION_TIME - 60000);
}

// ─── أمر البدء ───
handler.command = /^\.بكاسه$/i;

export default handler;
