let data = [];
let selectedChannel = "SVT 1";
let showPrevious = false;

const getMenu = () => document.querySelector(".menu");

window.addEventListener("load", () => {
  loadData();
});

function loadData() {
  render();
  fetch(`/data/${selectedChannel}.json`)
    .then((res) => res.json())
    .then((data) => {
      render(data);
    });
}

function isMenuOpen() {
  const menu = getMenu();
  return menu.style.left === '0px';
}

function toggleMenu() {
  if (isMenuOpen()) {
    animateMenu(false);
  } else {
    animateMenu(true);
  }
}

function animateMenu(show) {
  const menu = document.querySelector(".menu");
  const menuIcon = document.querySelector(".menu-icon > i");

  menuIcon.classList.remove(show ? "fa-bars" : "fa-times");
  menuIcon.classList.add(show ? "fa-times" : "fa-bars");
  
  let left = show ? -300 : 0;
  const interval = setInterval(() => {
    left = left + (show ? 10 : -10);
    menu.style.left = left + "px";
    if (show && left === 0 || !show && left === -300) {
      clearInterval(interval);
    }
  }, 10);
}

function setChannel(channel) {
  selectedChannel = channel;
  showPrevious = false;
  animateMenu(false);
  loadData();
}

function formatDate(date) {
  date = new Date(date);
  return date.toTimeString().substr(0, 5);
}

function getTimeOnly(date) {
  let timeOnly = new Date(0);
  timeOnly = new Date(timeOnly.setHours(date.getHours()));
  timeOnly = new Date(timeOnly.setMinutes(date.getMinutes()));
  return timeOnly;
}

function render(schedule) {
  //Render title
  document.querySelector("#js-title").innerHTML = selectedChannel;
  const loadingSpinner = document.querySelector("#js-loading");
  const scheduleWrapper = document.querySelector("#js-schedule");

  //Render data
  if (schedule) {
    //Sorting
    schedule.sort((a, b) => new Date(a.start) > new Date(b.start) ? 1 : -1);

    //Filter if only show in future
    if (!showPrevious) {
      schedule = schedule.filter(
        (s) => getTimeOnly(new Date(s.start)) > getTimeOnly(new Date())
      );
    }
    loadingSpinner.classList.add("hidden");
    let scheduleHTML = '<ul class="list-group list-group-flush">';
    if (!showPrevious) {
      scheduleHTML +=
        '<li class="list-group-item show-previous" onclick="showPrevious=true; loadData();">Visa tidigare program</li>';
    }
    scheduleHTML += schedule
      .map(
        (s) =>
          `<li class="list-group-item"><strong>${formatDate(
            new Date(s.start)
          )}</strong><div>${s.name}</div></li>`
      )
      .join("");
    scheduleHTML += "</ul>";
    scheduleWrapper.innerHTML = scheduleHTML;
  } else {
    scheduleWrapper.innerHTML = "";
    loadingSpinner.classList.remove("hidden");
  }
}
