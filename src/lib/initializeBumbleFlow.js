export function initializeBumbleFlow() {
  if (typeof window === 'undefined') return;
  if (window.__bumbleFlowInitialized) return;
  window.__bumbleFlowInitialized = true;
        const params = new URLSearchParams(window.location.search);
        const queryPage = params.get("page");
        const queryPlan = params.get("plan");
        const path = window.location.pathname.toLowerCase();
        const pathPage = path.includes("liked") ? "liked" : path.includes("chat") ? "chats" : "";
        const page = queryPage || pathPage || "discover";
        const pageToVariant = { discover: "discover", liked: "liked", chats: "chats" };
        const activeVariant = pageToVariant[page] || "discover";
        const phone = document.querySelector(".phone");
        const navVariants = document.querySelectorAll(".nav-variant");
        const navItems = document.querySelectorAll(".nav-item");
        const unlockButton = document.querySelector(".unlock-overlay");
        const paywall = document.querySelector(".paywall");
        const paywallClose = document.querySelector(".paywall-close");
        const paywallCta = document.querySelector(".paywall-cta");
        const firstCardHeart = document.querySelector(".first-card-heart");
        const firstMatchCard = document.querySelector(".first-match-card");
        const likedTransitionCard = document.querySelector(".liked-transition-card");
        const matchFlowOverlay = document.querySelector(".match-flow-overlay");
        const matchFinalStage = document.querySelector(".stage-match");
        const matchFlowClose = document.querySelector(".match-flow-close");
        const chatHistoryOverlay = document.querySelector(".chat-history-overlay");
        const openLindseyChatButton = document.querySelector(".open-lindsey-chat");
        const chatThreadOverlay = document.querySelector(".chat-thread-overlay");
        const chatThreadBack = document.querySelector(".chat-thread-back");
        const lookMoreTimesLink = document.querySelector(".look-more-times-link");
        const mutualAvailabilityOverlay = document.querySelector(".mutual-availability-overlay");
        const mutualAvailabilityBack = document.querySelector(".mutual-availability-back");
        const weekButtons = document.querySelectorAll(".day");
        const vibeButtons = document.querySelectorAll(".chips button");
        const planCards = document.querySelectorAll(".plan-card");
        const plannerLockable = document.querySelector(".planner-lockable");
        const calendarRow = document.querySelector(".calendar-sync-row");
        const calendarAction = document.querySelector(".calendar-action");
        const manualWindowCard = document.querySelector(".manual-window-card");
        const connectedView = document.querySelector(".connected-calendar-view");
        const connectedWeekButtons = document.querySelectorAll(".connected-week-day");
        const connectedDayTitle = document.querySelector(".connected-day-title");
        const connectedDaySubtitle = document.querySelector(".connected-day-subtitle");
        const connectedTimelineColumn = document.querySelector(".connected-timeline-column");
        const connectedTimeList = document.querySelector(".connected-time-list");
        const connectedEmptyState = document.querySelector(".connected-empty-state");
        const mutualGrid = document.querySelector(".mutual-grid");
        const manualInlineWrap = document.querySelector(".manual-window-inline");
        const manualInlineInput = document.querySelector(".manual-inline-input");
        const manualInlineConfirm = document.querySelector(".manual-inline-confirm");
        const manualInlineCancel = document.querySelector(".manual-inline-cancel");
        const addMoreTimeButton = document.querySelector(".add-more-time");
        const emptyAddManualButton = document.querySelector(".empty-add-manual");
        const manualOptions = document.querySelectorAll(".manual-option");
        const timeOptionsGrid = document.querySelector(".time-options-grid");
        const adjustDurationPanel = document.querySelector(".adjust-duration-panel");
        const adjustDurationClose = document.querySelector(".adjust-duration-close");
        const adjustDurationOptions = document.querySelector(".adjust-duration-options");
        const sendSuggestionButton = document.querySelector(".send-suggestion-button");
        const scheduleOptionsCard = document.querySelector(".schedule-options-card");
        const scheduleOptionsTitle = document.querySelector(".schedule-options-card h4");
        const scheduleOptionsSubtitle = document.querySelector(".schedule-options-card > p");
        const sentSuggestionMessage = document.querySelector(".sent-suggestion-message");
        const sentSuggestionList = document.querySelector(".sent-suggestion-list");
        const normalizeWindow = (value) => value.replace(/\s+/g, " ").trim().toLowerCase();
        let calendarSequenceTimeouts = [];
        const initialConnectedDayData = {
          m: { label: "Monday", slots: ["9:30 - 10:30 AM", "11:00 AM - 12:00 PM", "12:30 - 1:30 PM", "2:00 - 3:00 PM", "7:00 - 9:00 PM"] },
          t: { label: "Tuesday", slots: ["10:00 AM - 11:00 AM", "6:00 - 8:00 PM"] },
          w: { label: "Wednesday", slots: [] },
          th: { label: "Thursday", slots: ["9:00 - 10:00 AM", "5:00 - 6:30 PM"] },
          f: { label: "Friday", slots: ["11:00 AM - 12:00 PM", "7:00 - 9:00 PM"] },
          s: { label: "Saturday", slots: ["10:00 AM - 11:30 AM", "1:00 - 3:00 PM", "7:30 - 9:00 PM"] },
          su: { label: "Sunday", slots: [] },
        };
        const lindseyMockSchedule = {
          m: ["8:00 - 9:00 AM", "11:30 AM - 1:00 PM", "3:00 - 4:00 PM", "7:30 - 9:00 PM"],
          t: ["9:00 - 10:30 AM", "12:30 - 2:00 PM", "6:30 - 8:30 PM"],
          w: ["8:00 - 9:00 AM", "12:00 - 2:00 PM", "6:00 - 7:30 PM"],
          th: ["8:30 - 10:30 AM", "4:30 - 6:00 PM"],
          f: ["10:30 AM - 12:30 PM", "8:00 - 10:00 PM"],
          s: ["9:00 - 10:00 AM", "2:00 - 4:00 PM", "7:00 - 8:30 PM"],
          su: ["11:00 AM - 1:00 PM", "5:00 - 7:00 PM"],
        };
        const mutualDayOrder = ["m", "t", "w", "th", "f", "s", "su"];
        const MUTUAL_GRID_START_MINUTES = 8 * 60;
        const MUTUAL_GRID_END_MINUTES = 22 * 60;
        const MUTUAL_GRID_STEP_MINUTES = 30;
        const CHAT_SUGGESTION_DAY_KEY = "m";
        let connectedDayData = JSON.parse(JSON.stringify(initialConnectedDayData));
        let activeConnectedDay = "m";
        const starredSlots = new Set();
        let manualTargetDay = "w";
        let inlineEditorVisible = false;
        let matchFlowTimeouts = [];
        let chatThreadCloseTimeout = null;
        let likeTransitionTimeout = null;
        let hasMatched = false;
        const selectedTimeSlots = new Set();
        const navIconSrc = {
          profile: {
            filled: "/assets/icons/Property 1=Person Filled.svg",
            outline: "/assets/icons/Property 1=Person Not Filled.svg",
          },
          discover: {
            filled: "/assets/icons/Property 1=Discover Filled.svg",
            outline: "/assets/icons/Property 1=Discover Not Filled.svg",
          },
          people: {
            filled: "/assets/icons/Property 1=Bumble Filled.svg",
            outline: "/assets/icons/Property 1=Bumble Not Filled.svg",
          },
          liked: {
            filled: "/assets/icons/Property 1=Heart Filled.svg",
            outline: "/assets/icons/Property 1=Heart Not Filled.svg",
          },
          chats: {
            filled: "/assets/icons/Property 1=Chat Filled.svg",
            outline: "/assets/icons/Property 1=Chat Not Filled.svg",
          },
        };
  
        const toDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        const svgIcons = {
          navPerson: {
            outline: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="7.2" r="3.2" fill="none" stroke="#111" stroke-width="1.7"/><rect x="5.4" y="12.3" width="13.2" height="6.4" rx="3.2" fill="none" stroke="#111" stroke-width="1.7"/></svg>`,
            filled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="7.2" r="3.2" fill="#111"/><rect x="5.4" y="12.3" width="13.2" height="6.4" rx="3.2" fill="#111"/></svg>`,
          },
          navDiscover: {
            outline: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.6" fill="none" stroke="#111" stroke-width="1.7"/><path d="M9.5 14.5L11.7 9.4L16.6 7.4L14.3 12.5L9.5 14.5Z" fill="none" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="12" r="1.2" fill="#111"/></svg>`,
            filled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.6" fill="#111"/><path d="M9.5 14.5L11.7 9.4L16.6 7.4L14.3 12.5L9.5 14.5Z" fill="#fff"/><circle cx="12" cy="12" r="1.2" fill="#fff"/></svg>`,
          },
          navBumble: {
            outline: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="7.6,6.2 16.4,6.2 19.7,12 16.4,17.8 7.6,17.8 4.3,12" fill="none" stroke="#111" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 9.2H15M8.2 12H15.8M9 14.8H15" stroke="#111" stroke-width="1.5" stroke-linecap="round"/></svg>`,
            filled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="7.6,6.2 16.4,6.2 19.7,12 16.4,17.8 7.6,17.8 4.3,12" fill="#111"/><path d="M9 9.2H15M8.2 12H15.8M9 14.8H15" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
          },
          navHeart: {
            outline: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18.8S5.2 14.2 5.2 9.3C5.2 7 7 5.2 9.2 5.2C10.5 5.2 11.7 5.8 12.4 6.9C13.1 5.8 14.3 5.2 15.6 5.2C17.8 5.2 19.6 7 19.6 9.3C19.6 14.2 12.8 18.8 12 18.8Z" fill="none" stroke="#111" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
            filled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18.8S5.2 14.2 5.2 9.3C5.2 7 7 5.2 9.2 5.2C10.5 5.2 11.7 5.8 12.4 6.9C13.1 5.8 14.3 5.2 15.6 5.2C17.8 5.2 19.6 7 19.6 9.3C19.6 14.2 12.8 18.8 12 18.8Z" fill="#111"/></svg>`,
          },
          navChat: {
            outline: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 5.3C7.7 5.3 4.3 8.4 4.3 12.2C4.3 14.2 5.3 16 7 17.3L6.3 19.4L8.9 18.2C9.8 18.5 10.9 18.7 12 18.7C16.3 18.7 19.7 15.6 19.7 11.8C19.7 8 16.3 5.3 12 5.3Z" fill="none" stroke="#111" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
            filled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 5.3C7.7 5.3 4.3 8.4 4.3 12.2C4.3 14.2 5.3 16 7 17.3L6.3 19.4L8.9 18.2C9.8 18.5 10.9 18.7 12 18.7C16.3 18.7 19.7 15.6 19.7 11.8C19.7 8 16.3 5.3 12 5.3Z" fill="#111"/></svg>`,
          },
          statusCell: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 13"><rect x="1" y="9.5" width="2.8" height="2.5" rx="0.8" fill="#111"/><rect x="5.4" y="7.4" width="2.8" height="4.6" rx="0.8" fill="#111"/><rect x="9.8" y="5.2" width="2.8" height="6.8" rx="0.8" fill="#111"/><rect x="14.2" y="3" width="2.8" height="9" rx="0.8" fill="#111"/></svg>`,
          statusWifi: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 13"><path d="M1.3 4.3C3.3 2.4 6 1.3 9 1.3C12 1.3 14.7 2.4 16.7 4.3" fill="none" stroke="#111" stroke-width="1.5" stroke-linecap="round"/><path d="M3.9 7C5.3 5.8 7.1 5.1 9 5.1C10.9 5.1 12.7 5.8 14.1 7" fill="none" stroke="#111" stroke-width="1.5" stroke-linecap="round"/><circle cx="9" cy="9.8" r="1.3" fill="#111"/></svg>`,
          statusBattery: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 13"><rect x="1" y="1" width="23" height="11" rx="3" fill="none" stroke="#111" stroke-width="1.4"/><rect x="3" y="3" width="17" height="7" rx="2" fill="#111"/><rect x="24.5" y="4.1" width="2.3" height="4.8" rx="1.1" fill="#111"/></svg>`,
          calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="4.5" y="5.5" width="15" height="14" rx="2" fill="none" stroke="#111" stroke-width="1.8"/><path d="M4.5 9.2H19.5" stroke="#111" stroke-width="1.8" stroke-linecap="round"/><path d="M8.2 4.5V7M15.8 4.5V7" stroke="#111" stroke-width="1.8" stroke-linecap="round"/></svg>`,
          summaryHeart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18.8S5.2 14.2 5.2 9.3C5.2 7 7 5.2 9.2 5.2C10.5 5.2 11.7 5.8 12.4 6.9C13.1 5.8 14.3 5.2 15.6 5.2C17.8 5.2 19.6 7 19.6 9.3C19.6 14.2 12.8 18.8 12 18.8Z" fill="none" stroke="#111" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
          verified: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><path d="M11 2.6L14.1 3.4L16.8 2L18.4 4.8L21.2 6.4L19.8 9.1L20.6 12.2L17.8 13.8L16.2 16.6L13.5 15.2L10.4 16L8.8 13.2L6 11.6L7.4 8.9L6.6 5.8L9.4 4.2L11 1.4Z" fill="none" stroke="#111" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.5 11.3L10.4 13.1L13.8 8.8" fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
          photoFallback: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 360"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e9e1d9"/><stop offset="100%" stop-color="#d4c7b8"/></linearGradient></defs><rect width="300" height="360" rx="14" fill="url(#bg)"/><circle cx="150" cy="122" r="54" fill="#f4eee6"/><rect x="84" y="182" width="132" height="118" rx="62" fill="#f4eee6"/></svg>`,
          avatarFallback: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="av" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e7ded2"/><stop offset="100%" stop-color="#cfbfa9"/></linearGradient></defs><rect width="80" height="80" rx="40" fill="url(#av)"/><circle cx="40" cy="31" r="12" fill="#efe8de"/><rect x="23" y="46" width="34" height="23" rx="12" fill="#efe8de"/></svg>`,
          iconFallback: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4" fill="none" stroke="#111" stroke-width="1.6"/><circle cx="9" cy="9.2" r="1.8" fill="#111"/><path d="M6.8 16.8L10.4 13.2L13 15.6L16.6 12L17.2 16.8Z" fill="#111"/></svg>`,
        };
  
        const applyStatusBarIcons = () => {
          const cell = document.querySelector(".status-cell");
          const wifi = document.querySelector(".status-wifi");
          const battery = document.querySelector(".status-battery");
          if (cell) cell.src = "/assets/icons/Cellular Connection.svg";
          if (wifi) wifi.src = "/assets/icons/Wifi.svg";
          if (battery) battery.src = "/assets/icons/Battery.svg";
        };
  
        const applyCalendarIcons = () => {
          document.querySelectorAll(".calendar-icon-wrap img, .mini-calendar-button img").forEach((icon) => {
            icon.src = toDataUri(svgIcons.calendar);
          });
        };
  
        const applyBottomNavIcons = () => {
          document.querySelectorAll(".nav-item").forEach((item) => {
            const icon = item.querySelector("img");
            if (!icon) return;
            const target = item.dataset.pageTarget;
            const iconSet = target ? navIconSrc[target] : null;
            if (!iconSet) return;
            const iconState = item.classList.contains("active") ? "filled" : "outline";
            icon.src = iconSet[iconState];
          });
        };
  
        const applySummaryIcons = () => {
          document.querySelectorAll(".name-heart").forEach((icon) => {
            icon.src = "/assets/icons/Property 1=Heart Not Filled.svg";
          });
          document.querySelectorAll(".name-verified").forEach((icon) => {
            icon.src = "/assets/icons/Property 1=Verified.svg";
          });
        };
  
        const updateChatHistoryMatchState = () => {
          if (openLindseyChatButton) openLindseyChatButton.hidden = !hasMatched;
        };
  
        const applyFigmaImageFallbacks = () => {
          const photoFallback = toDataUri(svgIcons.photoFallback);
          const avatarFallback = toDataUri(svgIcons.avatarFallback);
          const iconFallback = toDataUri(svgIcons.iconFallback);
          document.querySelectorAll('img[src*="figma.com/api/mcp/asset"]').forEach((img) => {
            if (img.classList.contains("status-icon") || img.classList.contains("name-heart") || img.classList.contains("name-verified")) return;
            const fallback =
              img.classList.contains("match-photo") || img.classList.contains("match-flow-photo")
                ? photoFallback
                : img.closest(".chat-thread-head, .chat-history-item")
                  ? avatarFallback
                  : iconFallback;
            img.addEventListener("error", () => {
              img.src = fallback;
            });
            if (img.complete && img.naturalWidth === 0) img.src = fallback;
          });
        };
  
        const clearMatchFlowTimeouts = () => {
          matchFlowTimeouts.forEach((id) => clearTimeout(id));
          matchFlowTimeouts = [];
        };
  
        const setActiveVariantUi = (variantName) => {
          navVariants.forEach((variant) => {
            const isActive = variant.dataset.variant === variantName;
            variant.classList.toggle("active", isActive);
          });
          applyBottomNavIcons();
        };
  
        const openChatHistory = () => {
          if (!phone || !chatHistoryOverlay) return;
          phone.dataset.page = "chats";
          setActiveVariantUi("chats");
          phone.classList.remove("chat-thread-open");
          chatHistoryOverlay.classList.add("open");
          chatHistoryOverlay.setAttribute("aria-hidden", "false");
        };
  
        const closeChatHistory = () => {
          if (!chatHistoryOverlay) return;
          chatHistoryOverlay.classList.remove("open");
          chatHistoryOverlay.setAttribute("aria-hidden", "true");
        };
  
        const parseScheduleClock = (value, fallbackMeridiem = "") => {
          const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
          if (!match) return null;
          const rawHour = Number(match[1]);
          const minute = Number(match[2] || "0");
          const meridiem = (match[3] || fallbackMeridiem || "").toUpperCase();
          if (!["AM", "PM"].includes(meridiem)) return null;
          let hour24 = rawHour % 12;
          if (meridiem === "PM") hour24 += 12;
          return hour24 * 60 + minute;
        };
  
        const parseScheduleRange = (value) => {
          const normalized = value.replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
          const [rawStart = "", rawEnd = ""] = normalized.split(/\s*-\s*/);
          if (!rawStart || !rawEnd) return null;
          const endMeridiem = (rawEnd.match(/(AM|PM)/i) || [])[1] || "";
          const startMeridiem = (rawStart.match(/(AM|PM)/i) || [])[1] || endMeridiem;
          const start = parseScheduleClock(rawStart, startMeridiem);
          const end = parseScheduleClock(rawEnd, endMeridiem || startMeridiem);
          if (start === null || end === null || end <= start) return null;
          return [start, end];
        };

        const formatClockFromMinutes = (minutes, includeMeridiem = true) => {
          const hour24 = Math.floor(minutes / 60);
          const minute = minutes % 60;
          const meridiem = hour24 >= 12 ? "PM" : "AM";
          const hour12 = hour24 % 12 || 12;
          const minuteText = String(minute).padStart(2, "0");
          return includeMeridiem ? `${hour12}:${minuteText} ${meridiem}` : `${hour12}:${minuteText}`;
        };

        const normalizeManualSlotInput = (rawValue) => {
          const parsed = parseScheduleRange(rawValue);
          if (!parsed) return null;
          const [startMinutes, endMinutes] = parsed;
          const startMeridiem = startMinutes >= 12 * 60 ? "PM" : "AM";
          const endMeridiem = endMinutes >= 12 * 60 ? "PM" : "AM";

          if (startMeridiem === endMeridiem) {
            return `${formatClockFromMinutes(startMinutes, false)} - ${formatClockFromMinutes(endMinutes, false)} ${endMeridiem}`;
          }
          return `${formatClockFromMinutes(startMinutes, true)} - ${formatClockFromMinutes(endMinutes, true)}`;
        };

        const hasEquivalentSlotRange = (dayKey, slotLabel) => {
          const candidateRange = parseScheduleRange(slotLabel);
          if (!candidateRange) return false;
          const daySlots = connectedDayData[dayKey]?.slots || [];
          return daySlots.some((existingSlot) => {
            const existingRange = parseScheduleRange(existingSlot);
            return !!existingRange && existingRange[0] === candidateRange[0] && existingRange[1] === candidateRange[1];
          });
        };
  
        const mergeIntervals = (intervals) => {
          if (intervals.length === 0) return [];
          const sorted = intervals
            .map(([start, end]) => [start, end])
            .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
          const merged = [sorted[0]];
          for (let i = 1; i < sorted.length; i += 1) {
            const [start, end] = sorted[i];
            const current = merged[merged.length - 1];
            if (start <= current[1]) current[1] = Math.max(current[1], end);
            else merged.push([start, end]);
          }
          return merged;
        };
  
        const getMutualAvailabilityByDay = () => {
          const mutual = {};
          mutualDayOrder.forEach((dayKey) => {
            const kevinSlots = connectedDayData[dayKey]?.slots || [];
            const lindseySlots = lindseyMockSchedule[dayKey] || [];
            const overlaps = [];
            kevinSlots.forEach((kevinSlot) => {
              const kevinRange = parseScheduleRange(kevinSlot);
              if (!kevinRange) return;
              lindseySlots.forEach((lindseySlot) => {
                const lindseyRange = parseScheduleRange(lindseySlot);
                if (!lindseyRange) return;
                const start = Math.max(kevinRange[0], lindseyRange[0]);
                const end = Math.min(kevinRange[1], lindseyRange[1]);
                if (end > start) overlaps.push([start, end]);
              });
            });
            mutual[dayKey] = mergeIntervals(overlaps);
          });
          return mutual;
        };
  
        const formatDurationHours = (hours) => {
          if (Math.abs(hours - Math.round(hours)) < 0.001) return `${Math.round(hours)}H FREE`;
          return `${hours.toFixed(1)}H FREE`;
        };
  
        const getSlotDurationHours = (label) => {
          const range = parseScheduleRange(label);
          if (!range) return 1;
          return Math.max(0.5, (range[1] - range[0]) / 60);
        };
  
        const formatRangeLabel = (startMinutes, endMinutes) =>
          `${formatMinutesToTime(startMinutes, true)} - ${formatMinutesToTime(endMinutes, true)}`;
  
        const sortDaySlotsChronologically = (dayKey) => {
          const day = connectedDayData[dayKey];
          if (!day) return;
          day.slots.sort((left, right) => {
            const leftRange = parseScheduleRange(left);
            const rightRange = parseScheduleRange(right);
            if (!leftRange && !rightRange) return left.localeCompare(right);
            if (!leftRange) return 1;
            if (!rightRange) return -1;
            return leftRange[0] - rightRange[0] || leftRange[1] - rightRange[1];
          });
        };
  
        const getCurrentChatSuggestionDayKey = () => CHAT_SUGGESTION_DAY_KEY;
  
        const getTimeOptionButtons = () => {
          if (!timeOptionsGrid) return [];
          return Array.from(timeOptionsGrid.querySelectorAll(".time-option-button"));
        };
  
        const renderChatSuggestions = () => {
          if (!timeOptionsGrid) return;
          const dayKey = getCurrentChatSuggestionDayKey();
          const dayLabel = connectedDayData[dayKey]?.label || "Monday";
          const mutualIntervals = getMutualAvailabilityByDay()[dayKey] || [];
  
          if (scheduleOptionsTitle) {
            scheduleOptionsTitle.textContent =
              mutualIntervals.length > 0 ? `${dayLabel} mutual availability` : `No mutual availability for ${dayLabel}`;
          }
          if (scheduleOptionsSubtitle) {
            scheduleOptionsSubtitle.textContent =
              mutualIntervals.length > 0
                ? "Today’s suggestions are synced with both calendars."
                : "Try adding more times in Discover to find overlap.";
          }
  
          selectedTimeSlots.clear();
          if (adjustDurationPanel) adjustDurationPanel.hidden = true;
          if (adjustDurationOptions) adjustDurationOptions.innerHTML = "";
  
          if (mutualIntervals.length === 0) {
            timeOptionsGrid.innerHTML = "";
            updateSendSuggestionState();
            return;
          }
  
          timeOptionsGrid.innerHTML = mutualIntervals
            .map(([start, end]) => {
              const durationHours = Math.max(0.5, (end - start) / 60);
              const isLong = durationHours > 1;
              return `
                <button type="button" class="time-option-button ${isLong ? "long-slot" : ""}" data-duration-hours="${durationHours}" data-day-key="${dayKey}" data-day-label="${dayLabel}">
                  ${formatRangeLabel(start, end)}
                </button>
              `;
            })
            .join("");
  
          getTimeOptionButtons().forEach((button) => {
            button.dataset.originalLabel = button.textContent.trim();
            button.dataset.selectedDurationHours = button.dataset.durationHours || "1";
          });
  
          updateSendSuggestionState();
        };
  
        const refreshChatSuggestionsIfVisible = () => {
          if (!chatThreadOverlay || !chatThreadOverlay.classList.contains("open")) return;
          if (sentSuggestionMessage && !sentSuggestionMessage.hidden) return;
          renderChatSuggestions();
        };
  
        const renderMutualAvailabilityCalendar = () => {
          if (!mutualGrid) return;
          const mutualByDay = getMutualAvailabilityByDay();
          mutualGrid.innerHTML = "";
  
          mutualDayOrder.forEach((dayKey, dayIndex) => {
            const intervals = mutualByDay[dayKey] || [];
            intervals.forEach(([rawStart, rawEnd]) => {
              const clampedStart = Math.max(rawStart, MUTUAL_GRID_START_MINUTES);
              const clampedEnd = Math.min(rawEnd, MUTUAL_GRID_END_MINUTES);
              if (clampedEnd <= clampedStart) return;
              const startUnits = (clampedStart - MUTUAL_GRID_START_MINUTES) / MUTUAL_GRID_STEP_MINUTES;
              const spanUnits = (clampedEnd - clampedStart) / MUTUAL_GRID_STEP_MINUTES;
              const slot = document.createElement("span");
              slot.className = "mutual-slot";
              slot.style.gridColumn = String(dayIndex + 1);
              slot.style.gridRow = `${Math.floor(startUnits) + 1} / span ${Math.max(1, Math.round(spanUnits))}`;
              mutualGrid.appendChild(slot);
            });
          });
        };
  
        const refreshMutualAvailabilityIfOpen = () => {
          if (!mutualAvailabilityOverlay || !mutualAvailabilityOverlay.classList.contains("open")) return;
          renderMutualAvailabilityCalendar();
        };
  
        const openMutualAvailability = () => {
          if (!mutualAvailabilityOverlay || !phone) return;
          renderMutualAvailabilityCalendar();
          mutualAvailabilityOverlay.classList.remove("closing");
          mutualAvailabilityOverlay.classList.add("open");
          mutualAvailabilityOverlay.setAttribute("aria-hidden", "false");
          phone.classList.add("mutual-availability-open");
        };
  
        const closeMutualAvailability = () => {
          if (!mutualAvailabilityOverlay || !phone) return;
          mutualAvailabilityOverlay.classList.add("closing");
          window.setTimeout(() => {
            if (!mutualAvailabilityOverlay || !phone) return;
            mutualAvailabilityOverlay.classList.remove("open", "closing");
            mutualAvailabilityOverlay.setAttribute("aria-hidden", "true");
            phone.classList.remove("mutual-availability-open");
          }, 280);
        };
  
        const closeChatThread = () => {
          if (!chatThreadOverlay || !phone) return;
          if (chatThreadCloseTimeout) window.clearTimeout(chatThreadCloseTimeout);
          chatThreadOverlay.classList.add("closing");
          chatThreadCloseTimeout = window.setTimeout(() => {
            chatThreadOverlay.classList.remove("open", "closing");
            chatThreadOverlay.setAttribute("aria-hidden", "true");
            phone.classList.remove("chat-thread-open");
            chatThreadCloseTimeout = null;
          }, 280);
        };
  
        const openChatThread = () => {
          if (!chatThreadOverlay || !phone) return;
          if (chatThreadCloseTimeout) {
            window.clearTimeout(chatThreadCloseTimeout);
            chatThreadCloseTimeout = null;
          }
          renderChatSuggestions();
          chatThreadOverlay.classList.remove("closing");
          chatThreadOverlay.classList.add("open");
          chatThreadOverlay.setAttribute("aria-hidden", "false");
          phone.classList.add("chat-thread-open");
        };
  
        const openMatchFlow = () => {
          if (!matchFlowOverlay || !matchFinalStage) return;
          clearMatchFlowTimeouts();
          matchFlowOverlay.classList.remove("closing");
          matchFlowOverlay.classList.add("open");
          matchFlowOverlay.setAttribute("aria-hidden", "false");
          matchFinalStage.hidden = false;
          if (phone) phone.classList.add("matching-open");
          hasMatched = true;
          updateChatHistoryMatchState();
        };
  
        const closeMatchFlowToChats = () => {
          if (!matchFlowOverlay || !phone) return;
          clearMatchFlowTimeouts();
          matchFlowOverlay.classList.remove("open", "closing");
          matchFlowOverlay.setAttribute("aria-hidden", "true");
          if (matchFinalStage) matchFinalStage.hidden = true;
          phone.classList.remove("matching-open");
          openChatHistory();
        };
  
        const resetConnectedDayData = () => {
          connectedDayData = JSON.parse(JSON.stringify(initialConnectedDayData));
          activeConnectedDay = "m";
          manualTargetDay = "w";
          starredSlots.clear();
          inlineEditorVisible = false;
          refreshMutualAvailabilityIfOpen();
          refreshChatSuggestionsIfVisible();
        };
  
        const openInlineEditor = () => {
          inlineEditorVisible = true;
          if (manualInlineWrap) manualInlineWrap.hidden = false;
          if (manualInlineInput) manualInlineInput.focus();
        };
  
        const closeInlineEditor = () => {
          inlineEditorVisible = false;
          if (manualInlineWrap) manualInlineWrap.hidden = true;
          if (manualInlineInput) {
            manualInlineInput.value = "";
            manualInlineInput.classList.remove("filled");
          }
          refreshManualOptions();
        };
  
        const refreshManualOptions = () => {
          if (!manualInlineInput) return;
          const activeDaySlots = connectedDayData[manualTargetDay]?.slots || [];
          const selectedValue = normalizeWindow(manualInlineInput.value);
          const takenValues = new Set(activeDaySlots.map((slot) => normalizeWindow(slot)));
  
          manualOptions.forEach((button) => {
            const optionValue = normalizeWindow(button.dataset.value || button.textContent || "");
            button.hidden = takenValues.has(optionValue) || (!!selectedValue && optionValue === selectedValue);
          });
        };
  
        const updateConnectedWeekUi = () => {
          connectedWeekButtons.forEach((button) => {
            const day = button.dataset.day;
            const countPill = button.querySelector(".week-count");
            const count = day && connectedDayData[day] ? connectedDayData[day].slots.length : 0;
            if (countPill) {
              countPill.textContent = String(count);
              countPill.classList.toggle("empty", count === 0);
            }
            button.classList.toggle("active", day === activeConnectedDay);
          });
        };
  
        const renderTimeline = (slotCount) => {
          if (!connectedTimelineColumn) return;
          connectedTimelineColumn.innerHTML = "";
          const segments = slotCount > 0 ? slotCount : 1;
          for (let i = 0; i < segments; i += 1) {
            const segment = document.createElement("div");
            segment.className = "timeline-segment";
            connectedTimelineColumn.appendChild(segment);
          }
        };
  
        const renderConnectedDay = () => {
          const day = connectedDayData[activeConnectedDay];
          if (!day || !connectedDayTitle || !connectedDaySubtitle || !connectedTimeList || !connectedEmptyState || !addMoreTimeButton)
            return;
          sortDaySlotsChronologically(activeConnectedDay);
  
          const slotCount = day.slots.length;
          connectedDayTitle.textContent = day.label;
          connectedDaySubtitle.textContent = `${slotCount} available spots`;
          updateConnectedWeekUi();
          renderTimeline(slotCount);
          manualTargetDay = activeConnectedDay;
          refreshManualOptions();
  
          if (slotCount === 0) {
            connectedTimeList.hidden = true;
            connectedTimeList.innerHTML = "";
            connectedEmptyState.hidden = inlineEditorVisible;
            if (manualInlineWrap) manualInlineWrap.hidden = !inlineEditorVisible;
            addMoreTimeButton.hidden = true;
            if (connectedTimelineColumn) {
              const refHeight = manualInlineWrap && !manualInlineWrap.hidden ? manualInlineWrap.offsetHeight : connectedEmptyState.offsetHeight;
              connectedTimelineColumn.style.setProperty("--timeline-line-height", `${Math.max(160, refHeight)}px`);
            }
            return;
          }
  
          connectedEmptyState.hidden = true;
          if (manualInlineWrap) manualInlineWrap.hidden = !inlineEditorVisible;
          addMoreTimeButton.hidden = false;
          connectedTimeList.hidden = false;
          connectedTimeList.innerHTML = day.slots
            .map((time) => {
              const slotId = `${activeConnectedDay}|${time}`;
              const isStarred = starredSlots.has(slotId);
              const durationHours = getSlotDurationHours(time);
              return `
                <article class="connected-time-row ${isStarred ? "starred" : ""}" data-slot="${time}">
                  <div class="time-copy">
                    <h5>${time}</h5>
                    <p class="time-label">${formatDurationHours(durationHours)}</p>
                  </div>
                  <div class="row-actions">
                    <button class="star-button ${isStarred ? "active" : ""}" type="button" aria-label="Favorite slot">${isStarred ? "★" : "☆"}</button>
                    <button class="remove-button" type="button" aria-label="Remove slot">×</button>
                  </div>
                </article>
              `;
            })
            .join("");
          if (connectedTimelineColumn) {
            connectedTimelineColumn.style.setProperty("--timeline-line-height", `${connectedTimeList.offsetHeight}px`);
          }
        };
  
        const resetCalendarUi = () => {
          if (!phone || !calendarRow || !calendarAction || !connectedView) return;
          calendarRow.dataset.state = "connect";
          phone.dataset.calendar = "idle";
          calendarAction.disabled = false;
          closeInlineEditor();
          resetConnectedDayData();
          if (manualWindowCard) manualWindowCard.hidden = false;
          if (plannerLockable) plannerLockable.dataset.synced = "false";
          connectedView.classList.remove("active");
          connectedView.setAttribute("aria-hidden", "true");
          if (addMoreTimeButton) addMoreTimeButton.hidden = false;
          if (connectedEmptyState) connectedEmptyState.hidden = true;
          renderConnectedDay();
          refreshChatSuggestionsIfVisible();
        };
  
        if (phone) {
          phone.dataset.page = page;
          if (queryPlan === "free" || queryPlan === "premium") phone.dataset.plan = queryPlan;
          if (phone.dataset.plan !== "premium") resetCalendarUi();
        }
        applyStatusBarIcons();
        applyCalendarIcons();
        applySummaryIcons();
        renderMutualAvailabilityCalendar();
        updateChatHistoryMatchState();
        setActiveVariantUi(activeVariant);
        applyFigmaImageFallbacks();
  
        navItems.forEach((item) => {
          item.addEventListener("click", (event) => {
            const target = item.dataset.pageTarget;
            if (!target || !phone) return;
            if (target === "discover") {
              event.preventDefault();
              phone.dataset.page = "discover";
              closeChatHistory();
              if (chatThreadOverlay) {
                chatThreadOverlay.classList.remove("open", "closing");
                chatThreadOverlay.setAttribute("aria-hidden", "true");
              }
              if (mutualAvailabilityOverlay) {
                mutualAvailabilityOverlay.classList.remove("open", "closing");
                mutualAvailabilityOverlay.setAttribute("aria-hidden", "true");
              }
              phone.classList.remove("chat-thread-open");
              phone.classList.remove("mutual-availability-open");
              setActiveVariantUi("discover");
              return;
            }
            if (target === "chats") {
              event.preventDefault();
              openChatHistory();
            }
          });
        });
  
        weekButtons.forEach((button) => {
          button.addEventListener("click", () => button.classList.toggle("active"));
        });
  
        vibeButtons.forEach((button) => {
          button.addEventListener("click", () => button.classList.toggle("active"));
        });
  
        const openPaywall = () => {
          if (!paywall) return;
          paywall.classList.add("open");
          paywall.setAttribute("aria-hidden", "false");
        };
  
        const closePaywall = () => {
          if (!paywall) return;
          paywall.classList.remove("open");
          paywall.setAttribute("aria-hidden", "true");
        };
  
        if (unlockButton) unlockButton.addEventListener("click", openPaywall);
        if (paywallClose) paywallClose.addEventListener("click", closePaywall);
  
        planCards.forEach((card) => {
          card.addEventListener("click", () => {
            planCards.forEach((item) => item.classList.remove("selected"));
            card.classList.add("selected");
            if (paywallCta && card.dataset.cta) paywallCta.textContent = card.dataset.cta;
          });
        });
  
        if (paywallCta) {
          paywallCta.addEventListener("click", () => {
            if (phone) phone.dataset.plan = "premium";
            resetCalendarUi();
            closePaywall();
          });
        }
  
        if (firstCardHeart) {
          firstCardHeart.addEventListener("click", () => {
            if (!phone) return;
            if (phone.dataset.plan !== "premium") {
              openPaywall();
              return;
            }
            if (likeTransitionTimeout) {
              window.clearTimeout(likeTransitionTimeout);
              likeTransitionTimeout = null;
            }
            if (firstMatchCard) firstMatchCard.classList.add("liked-state");
            if (likedTransitionCard) likedTransitionCard.hidden = false;
  
            likeTransitionTimeout = window.setTimeout(() => {
              if (firstMatchCard) firstMatchCard.classList.remove("liked-state");
              if (likedTransitionCard) likedTransitionCard.hidden = true;
              openMatchFlow();
              likeTransitionTimeout = null;
            }, 1600);
          });
        }
  
        if (matchFlowClose) {
          matchFlowClose.addEventListener("click", closeMatchFlowToChats);
        }
  
        if (openLindseyChatButton) {
          openLindseyChatButton.addEventListener("click", openChatThread);
        }
  
        if (chatThreadBack) {
          chatThreadBack.addEventListener("click", closeChatThread);
        }
  
        if (lookMoreTimesLink) {
          lookMoreTimesLink.addEventListener("click", (event) => {
            event.preventDefault();
            openMutualAvailability();
          });
        }
  
        if (mutualAvailabilityBack) {
          mutualAvailabilityBack.addEventListener("click", closeMutualAvailability);
        }
  
        const clearCalendarTimeouts = () => {
          calendarSequenceTimeouts.forEach((id) => clearTimeout(id));
          calendarSequenceTimeouts = [];
        };
  
        const syncCalendar = () => {
          if (!phone || !calendarRow || !calendarAction || !connectedView) return;
          if (phone.dataset.plan !== "premium") return;
          if (phone.dataset.calendar === "synced") return;
  
          clearCalendarTimeouts();
          calendarAction.disabled = true;
          calendarRow.dataset.state = "loading";
  
          const showConnected = window.setTimeout(() => {
            calendarRow.dataset.state = "connected";
          }, 1800);
  
          const showSyncedScreen = window.setTimeout(() => {
            calendarRow.dataset.state = "synced";
            phone.dataset.calendar = "synced";
            if (manualWindowCard) manualWindowCard.hidden = true;
            if (plannerLockable) plannerLockable.dataset.synced = "true";
            connectedView.setAttribute("aria-hidden", "false");
            connectedView.classList.add("active");
            calendarAction.disabled = false;
            renderConnectedDay();
          }, 4200);
  
          calendarSequenceTimeouts.push(showConnected, showSyncedScreen);
        };
  
        if (calendarAction) {
          calendarAction.addEventListener("click", syncCalendar);
        }
  
        connectedWeekButtons.forEach((button) => {
          button.addEventListener("click", () => {
            if (!button.dataset.day) return;
            activeConnectedDay = button.dataset.day;
            manualTargetDay = activeConnectedDay;
            closeInlineEditor();
            renderConnectedDay();
          });
        });
  
        if (connectedTimeList) {
          connectedTimeList.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            const row = target.closest(".connected-time-row");
            if (!row) return;
            const time = row.dataset.slot;
            if (!time) return;
            const slotId = `${activeConnectedDay}|${time}`;
  
            if (target.classList.contains("star-button")) {
              if (starredSlots.has(slotId)) starredSlots.delete(slotId);
              else starredSlots.add(slotId);
              renderConnectedDay();
              return;
            }
  
            if (target.classList.contains("remove-button")) {
              connectedDayData[activeConnectedDay].slots = connectedDayData[activeConnectedDay].slots.filter((slot) => slot !== time);
              starredSlots.delete(slotId);
              renderConnectedDay();
              refreshMutualAvailabilityIfOpen();
              refreshChatSuggestionsIfVisible();
            }
          });
        }
  
        if (addMoreTimeButton) {
          addMoreTimeButton.addEventListener("click", () => {
            const day = connectedDayData[activeConnectedDay];
            if (!day) return;
            manualTargetDay = activeConnectedDay;
            openInlineEditor();
            renderConnectedDay();
          });
        }
  
        if (emptyAddManualButton) {
          emptyAddManualButton.addEventListener("click", () => {
            manualTargetDay = activeConnectedDay;
            openInlineEditor();
            renderConnectedDay();
          });
        }
  
        manualOptions.forEach((button) => {
          button.dataset.value = button.textContent || "";
          button.addEventListener("click", () => {
            if (!manualInlineInput) return;
            manualInlineInput.value = button.textContent || "";
            manualInlineInput.classList.add("filled");
            refreshManualOptions();
          });
        });
  
        if (manualInlineInput) {
          manualInlineInput.addEventListener("input", () => {
            manualInlineInput.classList.toggle("filled", manualInlineInput.value.trim().length > 0);
            refreshManualOptions();
          });
        }
  
        if (manualInlineConfirm) {
          manualInlineConfirm.addEventListener("click", () => {
            if (!manualInlineInput) return;
            const value = manualInlineInput.value.trim();
            if (!value) return;
            const normalizedValue = normalizeManualSlotInput(value);
            if (!normalizedValue) return;
            if (!hasEquivalentSlotRange(manualTargetDay, normalizedValue)) {
              connectedDayData[manualTargetDay].slots.push(normalizedValue);
              sortDaySlotsChronologically(manualTargetDay);
            }
            closeInlineEditor();
            activeConnectedDay = manualTargetDay;
            renderConnectedDay();
            refreshMutualAvailabilityIfOpen();
            refreshChatSuggestionsIfVisible();
          });
        }
  
        if (manualInlineCancel) {
          manualInlineCancel.addEventListener("click", () => {
            closeInlineEditor();
            renderConnectedDay();
          });
        }
  
        const formatDurationLabel = (value) => (Number.isInteger(value) ? `${value}h` : `${value.toFixed(1)}h`);
        const formatDurationBlockLabel = (value) => (value === 1 ? "1 hour block" : `${value} hour block`);
  
        const parseTimeToMinutes = (timeText, fallbackMeridiem = "PM") => {
          const match = timeText.trim().toUpperCase().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
          if (!match) return null;
          const hour12 = Number(match[1]);
          const minute = Number(match[2]);
          const meridiem = match[3] || fallbackMeridiem;
          let hour24 = hour12 % 12;
          if (meridiem === "PM") hour24 += 12;
          return hour24 * 60 + minute;
        };
  
        const formatMinutesToTime = (minutes, includeMeridiem = true) => {
          const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
          const hour24 = Math.floor(normalized / 60);
          const minute = normalized % 60;
          const meridiem = hour24 >= 12 ? "PM" : "AM";
          const hour12 = hour24 % 12 || 12;
          const minuteText = String(minute).padStart(2, "0");
          return includeMeridiem ? `${hour12}:${minuteText} ${meridiem}` : `${hour12}:${minuteText}`;
        };
  
        const getRangeParts = (labelText) => {
          const [startRaw = "", endRaw = ""] = labelText.split("-").map((part) => part.trim());
          const endMeridiemMatch = endRaw.toUpperCase().match(/(AM|PM)$/);
          const startMeridiemMatch = startRaw.toUpperCase().match(/(AM|PM)$/);
          const endMeridiem = endMeridiemMatch ? endMeridiemMatch[1] : "PM";
          const startHasMeridiem = Boolean(startMeridiemMatch);
          const startMinutes = parseTimeToMinutes(startRaw, endMeridiem);
          const startText = startRaw.replace(/\s*(AM|PM)$/i, "").trim();
          return { startMinutes, startText, startHasMeridiem, endMeridiem };
        };
  
        const updateLongSlotLabel = (button, durationHours) => {
          if (!button.dataset.originalLabel) button.dataset.originalLabel = button.textContent.trim();
          const { startMinutes, startText, startHasMeridiem, endMeridiem } = getRangeParts(button.dataset.originalLabel);
          if (startMinutes === null) return;
          const newEnd = startMinutes + durationHours * 60;
          const startDisplay = startHasMeridiem ? formatMinutesToTime(startMinutes, true) : startText;
          const endDisplay = formatMinutesToTime(newEnd, true);
          button.textContent = `${startDisplay} - ${endDisplay}`;
          button.dataset.selectedDurationHours = String(durationHours);
        };
  
        const showAdjustDuration = (maxHours) => {
          if (!adjustDurationPanel || !adjustDurationOptions) return;
          if (maxHours <= 1) {
            adjustDurationPanel.hidden = true;
            adjustDurationOptions.innerHTML = "";
            return;
          }
  
          const options = [];
          for (let duration = 1; duration <= maxHours; duration += 0.5) {
            options.push(Number(duration.toFixed(1)));
          }
  
          adjustDurationOptions.innerHTML = options
            .map(
              (duration, index) => `
                <button type="button" class="duration-option-button ${index === options.length - 1 ? "active" : ""}" data-duration="${duration}">
                  ${formatDurationLabel(duration)}
                </button>
              `
            )
            .join("");
          adjustDurationPanel.hidden = false;
        };
  
        const updateSendSuggestionState = () => {
          if (!sendSuggestionButton) return;
          const selectedCount = selectedTimeSlots.size;
          sendSuggestionButton.hidden = selectedCount === 0;
          sendSuggestionButton.textContent = selectedCount > 1 ? `Send suggestion (${selectedCount})` : "Send suggestion";
        };
  
        const updateAdjustDurationState = () => {
          const selectedLongSlots = Array.from(selectedTimeSlots).filter(
            (slot) => Number(slot.dataset.durationHours || "1") > 1
          );
          if (selectedLongSlots.length === 0) {
            if (adjustDurationPanel) adjustDurationPanel.hidden = true;
            if (adjustDurationOptions) adjustDurationOptions.innerHTML = "";
            return;
          }
          const longestSlot = selectedLongSlots.reduce((max, slot) => Math.max(max, Number(slot.dataset.durationHours || "1")), 1);
          showAdjustDuration(longestSlot);
        };
  
        if (timeOptionsGrid) {
          timeOptionsGrid.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            const button = target.closest(".time-option-button");
            if (!button) return;
            const isSelected = button.classList.toggle("active");
            if (isSelected) selectedTimeSlots.add(button);
            else {
              selectedTimeSlots.delete(button);
              if (button.classList.contains("long-slot")) {
                button.textContent = button.dataset.originalLabel || button.textContent;
                button.dataset.selectedDurationHours = button.dataset.durationHours || "1";
              }
            }
            updateSendSuggestionState();
            updateAdjustDurationState();
          });
        }
  
        if (adjustDurationClose) {
          adjustDurationClose.addEventListener("click", () => {
            if (adjustDurationPanel) adjustDurationPanel.hidden = true;
          });
        }
  
        if (adjustDurationOptions) {
          adjustDurationOptions.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement) || !target.classList.contains("duration-option-button")) return;
            adjustDurationOptions.querySelectorAll(".duration-option-button").forEach((button) => button.classList.remove("active"));
            target.classList.add("active");
            const selectedDuration = Number(target.dataset.duration || "1");
            selectedTimeSlots.forEach((slotButton) => {
              if (!slotButton.classList.contains("long-slot")) return;
              updateLongSlotLabel(slotButton, selectedDuration);
            });
          });
        }
  
        const sendSuggestionsToThread = (items) => {
          if (!sentSuggestionMessage || !sentSuggestionList || !scheduleOptionsCard || items.length === 0) return;
          sentSuggestionList.innerHTML = items
            .map(
              ({ day = "Monday", label, duration = 1 }) => `
                <div class="sent-suggestion-item">
                  <p class="sent-suggestion-item-title">${day}, ${label}</p>
                  <p class="sent-suggestion-item-subtitle">${formatDurationBlockLabel(duration)}</p>
                </div>
              `
            )
            .join("");
          scheduleOptionsCard.hidden = true;
          sentSuggestionMessage.hidden = false;
        };
  
        if (sendSuggestionButton) {
          sendSuggestionButton.addEventListener("click", () => {
            if (selectedTimeSlots.size === 0) return;
            const selectedInOrder = getTimeOptionButtons().filter((button) => selectedTimeSlots.has(button));
            const payload = selectedInOrder
              .map((button) => {
                const duration = Number(button.dataset.selectedDurationHours || button.dataset.durationHours || "1");
                const day = button.dataset.dayLabel || "Monday";
                return { day, label: button.textContent.trim(), duration };
              });
            sendSuggestionsToThread(payload);
            selectedTimeSlots.clear();
            getTimeOptionButtons().forEach((button) => {
              button.classList.remove("active");
              button.textContent = button.dataset.originalLabel || button.textContent;
              button.dataset.selectedDurationHours = button.dataset.durationHours || "1";
            });
            if (adjustDurationPanel) adjustDurationPanel.hidden = true;
            if (adjustDurationOptions) adjustDurationOptions.innerHTML = "";
            updateSendSuggestionState();
          });
        }
  
        renderChatSuggestions();
        updateSendSuggestionState();
}
