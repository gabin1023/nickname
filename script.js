document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generate-btn");
    const copyBtn = document.getElementById("copy-btn");
    const nicknameOutput = document.getElementById("nickname-output");

    // 닉네임 유형 선택
    const nicknameTypeRadios = document.getElementsByName("nickname-type");
    const randomOptionsDiv = document.getElementById("random-options");

    // 무작위 조합 옵션
    const charLengthSelect = document.getElementById("char-length");
    const includeFinalConsonant = document.getElementById("include-final-consonant");
    const includeDoubleConsonant = document.getElementById("include-double-consonant");
    const requiredWordInput = document.getElementById("required-word"); // ✅ 필수 단어 입력칸 추가
    const errorMessage = document.getElementById("error-message"); // ✅ 오류 메시지 추가

    let adjectiveList = [];
    let nounList = [];
    let dataLoaded = false;

    // ✅ JSON 데이터 불러오기
    function loadJsonData() {
        fetch("./data.json") // JSON 경로 확인!
            .then(response => {
                if (!response.ok) {
                    throw new Error(`❌ JSON 파일 로드 실패! 상태 코드: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("✅ JSON 데이터 로드 성공:", data);
                adjectiveList = data.adjectives || [];
                nounList = data.nouns || [];
                dataLoaded = true;
            })
            .catch(error => {
                console.error("❌ JSON 로드 오류 발생:", error);
                alert("🚨 JSON을 불러올 수 없습니다! Live Server가 실행 중인지 확인하세요.");
            });
    }

    

    // 닉네임 유형 변경 시 옵션 표시/숨김
    nicknameTypeRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            randomOptionsDiv.style.display = (radio.value === "random") ? "block" : "none";
        });
    });

    // 닉네임 생성 버튼 클릭
    generateBtn.addEventListener("click", () => {
        let selectedType = document.querySelector('input[name="nickname-type"]:checked').value;
        let nickname = (selectedType === "adj-noun") ? generateAdjNounNickname() : generateRandomNickname();
        nicknameOutput.textContent = nickname;
    });

    // 닉네임 복사 기능
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(nicknameOutput.textContent)
            .then(() => alert("닉네임이 복사되었습니다!"))
            .catch(err => console.error("복사 실패:", err));
    });

    // ✅ 닉네임 생성 함수 (형용사 + 명사)
    function generateAdjNounNickname() {
        if (!dataLoaded || adjectiveList.length === 0 || nounList.length === 0) {
            console.warn("🚨 데이터가 아직 로드되지 않았습니다. 다시 시도해주세요.");
            return "데이터 로딩 중...";
        }

        let randomAdj = adjectiveList[Math.floor(Math.random() * adjectiveList.length)];
        let randomNoun = nounList[Math.floor(Math.random() * nounList.length)];

        return `${randomAdj} ${randomNoun}`;
    }

    // ✅ JSON 데이터 불러오기 실행!
    loadJsonData();

    // 페이지 로드 시 JSON 데이터 불러오기
    document.addEventListener("DOMContentLoaded", () => {
    loadJsonData();
    });

    
    // 무작위 조합 닉네임 생성 (모든 글자의 초성에서 겹자음 제외)
    function generateRandomNickname() {
    const length = parseInt(charLengthSelect.value);
    const useFinalConsonant = includeFinalConsonant.checked;
    const useDoubleConsonant = includeDoubleConsonant.checked;
    const requiredWord = requiredWordInput.value.trim(); // ✅ 필수 단어 가져오기

    // ✅ 필수 단어가 선택한 글자 수보다 길면 오류 메시지 표시 후 함수 종료
    if (requiredWord.length > length) {
        errorMessage.textContent = `필수 단어는 ${length}글자 이하로 입력해주세요!`;
        errorMessage.style.display = "block";
        return "";
    }
    errorMessage.style.display = "none"; // ✅ 오류 메시지 숨기기

    // 초성(모든 글자의 첫 자음) 리스트 - 겹자음 제외
    const initialConsonants = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

    // 중성(모음) 리스트
    const vowels = ["ㅏ", "ㅑ", "ㅓ", "ㅕ", "ㅗ", "ㅛ", "ㅜ", "ㅠ", "ㅡ", "ㅣ"];

    // 종성(받침) 리스트
    let finalConsonants = ["", "ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

    // 겹자음이 허용될 경우, 종성(받침)에서만 추가
    if (useDoubleConsonant) {
        finalConsonants.push("ㄲ", "ㄳ", "ㄵ", "ㄶ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅄ");
    }

    let remainingLength = length - requiredWord.length; // ✅ 남은 글자 수 계산
    let nicknameArray = new Array(length).fill(""); // ✅ 닉네임을 만들 배열 생성

    // ✅ 필수 단어를 랜덤한 위치에 삽입
    let randomIndex = Math.floor(Math.random() * (length - requiredWord.length + 1)); 
    for (let i = 0; i < requiredWord.length; i++) {
        nicknameArray[randomIndex + i] = requiredWord[i];
    }

    // ✅ 나머지 빈칸을 랜덤 문자로 채우기
    for (let i = 0; i < length; i++) {
        if (nicknameArray[i] === "") { // 빈칸만 채움
            let randConsonant = initialConsonants[Math.floor(Math.random() * initialConsonants.length)];
            let randVowel = vowels[Math.floor(Math.random() * vowels.length)];
            let randFinal = "";

            if (includeFinalConsonant.checked && i === length - 1) {
                randFinal = finalConsonants[Math.floor(Math.random() * finalConsonants.length)];
            }

            nicknameArray[i] = combineHangul(randConsonant, randVowel, randFinal);
        }
    }

    return nicknameArray.join(""); // ✅ 배열을 문자열로 변환 후 반환


    let nickname = "";

    for (let i = 0; i < length; i++) {
        let randConsonant = initialConsonants[Math.floor(Math.random() * initialConsonants.length)];
        let randVowel = vowels[Math.floor(Math.random() * vowels.length)];
        let randFinal = "";

        if (useFinalConsonant && i === length - 1) {
            randFinal = finalConsonants[Math.floor(Math.random() * finalConsonants.length)];
        }

        // 한글 유니코드 조합
        let syllable = combineHangul(randConsonant, randVowel, randFinal);
        nickname += syllable;
    }

    return nickname;
    }


    // 초성, 중성, 종성을 유니코드로 변환하는 함수
    function combineHangul(cho, jung, jong) {
        const CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
        const JUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
        const JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

        let choIndex = CHO.indexOf(cho);
        let jungIndex = JUNG.indexOf(jung);
        let jongIndex = JONG.indexOf(jong);

        if (choIndex === -1 || jungIndex === -1) return cho + jung + jong; // 조합 불가능한 경우 그냥 반환

        let unicode = 0xAC00 + (choIndex * 588) + (jungIndex * 28) + jongIndex;
        return String.fromCharCode(unicode);
    }
    });

document.addEventListener("DOMContentLoaded", () => {
    const rareNicknameBtn = document.getElementById("rare-nickname-btn");
    const rareNicknameOutput = document.getElementById("rare-nickname-output");
    let rareNicknames = [];

    // JSON 데이터 불러오기
    function loadRareNicknames() {
        fetch("rare_nicknames.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("JSON 파일을 불러오는 데 실패했습니다.");
                }
                return response.json();
            })
            .then(data => {
                rareNicknames = data.rareNicknames || [];
                console.log("레어 닉네임 데이터 로드 완료:", rareNicknames.length, "개");
            })
            .catch(error => {
                console.error("레어 닉네임 JSON 로드 오류:", error);
            });
    }

    // 레어 닉네임 3개 추천 함수
    function recommendRareNicknames() {
        if (rareNicknames.length === 0) {
            rareNicknameOutput.textContent = "닉네임을 불러오는 중...";
            return;
        }

        let selectedNicknames = [];
        while (selectedNicknames.length < 3) {
            let randomName = rareNicknames[Math.floor(Math.random() * rareNicknames.length)];
            if (!selectedNicknames.includes(randomName)) {
                selectedNicknames.push(randomName);
            }
        }

        rareNicknameOutput.innerHTML = selectedNicknames.join("<br>"); // 닉네임 3개 출력
    }

    // 버튼 클릭 이벤트
    rareNicknameBtn.addEventListener("click", recommendRareNicknames);

    // JSON 데이터 불러오기 실행
    loadRareNicknames();
});
