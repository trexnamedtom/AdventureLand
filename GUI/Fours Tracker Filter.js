////////////////////////////////
//	Tracker Filter GUI	//
///////////////////////////////

//this used to have a Gold per hour GUI also, i am not sure if i removed all of that, so might be some leftover useless code here

//Enable time till level
var gui_timer = true;

// Kills till level = 0, XP till level = 1
var till_level = 0; 

// GUI Variables
var minute_refresh; // how long before the clock refreshes
var last_target = null;
var gold = character.gold;
var date = new Date();
var p = parent;

function init_xptimer(minref) {
  minute_refresh = minref || 1;
  p.add_log(minute_refresh.toString() + ' min until tracker refresh!', 0x00FFFF);

  let $ = p.$;
  let brc = $('#bottomrightcorner');

  brc.find('#xptimer').remove();

  let xpt_container = $('<div id="xptimer"></div>').css({
    background: 'black',
    border: 'solid gray',
    borderWidth: '5px 5px',
    width: '320px',
    height: '96px',
    fontSize: '28px',
    color: '#77EE77',
    textAlign: 'center',
    display: 'table',
    overflow: 'hidden',
    marginBottom: '-5px'
  });

  let xptimer = $('<div id="xptimercontent"></div>')
    .css({
      display: 'table-cell',
      verticalAlign: 'middle'
    })
    .html('Estimated time until level up:<br><span id="xpcounter" style="font-size: 40px !important; line-height: 28px">Loading...</span><br><span id="xprate">(Kill something!)</span>')
    .appendTo(xpt_container);

  brc.children().first().after(xpt_container);
}


var last_minutes_checked = new Date();
var last_xp_checked_minutes = character.xp;
var last_xp_checked_kill = character.xp;
// lxc_minutes = xp after {minute_refresh} min has passed, lxc_kill = xp after a kill (the timer updates after each kill)

function update_xptimer() {
  if (character.xp == last_xp_checked_kill) return;

  let $ = p.$;
  let now = new Date();

  let time = Math.round((now.getTime() - last_minutes_checked.getTime()) / 1000);
  if (time < 1) return; // 1s safe delay
  let xp_rate = Math.round((character.xp - last_xp_checked_minutes) / time);
  if (time > 60 * minute_refresh) {
    last_minutes_checked = new Date();
    last_xp_checked_minutes = character.xp;
  }
  last_xp_checked_kill = character.xp;

  let xp_missing = p.G.levels[character.level] - character.xp;
  let seconds = Math.round(xp_missing / xp_rate);
  let minutes = Math.round(seconds / 60);
  let hours = Math.round(minutes / 60);
  let counter = `${hours}h ${minutes % 60}min`;

  $('#xpcounter').text(counter);
  $('#xprate').text(`${ncomma(xp_rate)} XP/s`);
}


if (till_level === 0)

function updateGUI() {
  let $ = p.$;
  let xp_percent = ((character.xp / p.G.levels[character.level]) * 100).toFixed(2);
  let xp_string = `LV${character.level} ${xp_percent}%`;
  var goldPerHour = 0;
  if (p.ctarget && p.ctarget.type == 'monster') {
    last_target = p.ctarget.mtype;
  }
  if (last_target) {
    let xp_missing = p.G.levels[character.level] - character.xp;
    let monster_xp = p.G.monsters[last_target].xp;
    goldPerHour = Math.round((character.gold - gold) / ((new Date() - date) / 3600000));
    let party_modifier = character.party ? 1.5 / p.party_list.length : 1;
    let monsters_left = Math.ceil(xp_missing / (monster_xp * party_modifier * character.xpm));
    xp_string += ` (${ncomma(monsters_left)} kills to go!)`;
  }
  $('#xpui').html(xp_string);
  $('#goldui').html(goldPerHour.toLocaleString('en-US', {
    minimumFractionDigits: 0
  }) + " Gold/hour");
  $('#goldgainloss').html(ncomma(character.gold - gold) + " Gold gain/lost");
} else if (till_level === 1)

function updateGUI() {
  let $ = p.$;
  let xp_percent = ((character.xp / G.levels[character.level]) * 100).toFixed(2);
  let xp_missing = ncomma(G.levels[character.level] - character.xp);
  let xp_string = `LV${character.level} ${xp_percent}% (${xp_missing}) xp to go!`;
  var goldPerHour = 0;
  if (p.ctarget && p.ctarget.type == 'monster') {
    last_target = p.ctarget.mtype;
  }
  goldPerHour = Math.round((character.gold - gold) / ((new Date() - date) / 3600000));
  let party_modifier = character.party ? 1.5 / p.party_list.length : 1;
  $('#xpui').html(xp_string);
  $('#goldui').html(goldPerHour.toLocaleString('en-US', {
    minimumFractionDigits: 0
  }) + " Gold/hour");
  $('#goldgainloss').html(ncomma(character.gold - gold) + " Gold gain/lost");
}

function ncomma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


if (gui_timer) {
  init_xptimer(5);
}

var ui_gamelog = function() {
  var gamelog_data = {
    kills: {
      show: true,
      regex: /killed/,
      tab_name: 'Kills'
    },
    gold: {
      show: true,
      regex: /gold/,
      tab_name: 'Gold'
    },
    party: {
      show: true,
      regex: /party/,
      tab_name: 'Party'
    },
    items: {
      show: true,
      regex: /found/,
      tab_name: 'Items'
    },
    upgrade_and_compound: {
      show: true,
      regex: /(upgrade|combination)/,
      tab_name: 'Upgr.'
    },
    errors: {
      show: true,
      regex: /(error|line|column)/i,
      tab_name: 'Errors'
    }
  };

  // filter buttons are alternating lighter and darker for aesthetic effect
  // colours in order are: dark blue, light blue, white, dark gray, light gray, lighter gray
  var filter_colours = {
    on_dark: '#151342',
    on_light: '#1D1A5C',
    on_text: '#FFF',
    off_dark: '#222',
    off_light: '#333',
    off_text: '#999'
  };

  var $ = parent.$;

  init_timestamps();
  init_gamelog_filter();

  function init_gamelog_filter() {

    //$('#bottomrightcorner').find('#goldui')[0].style.lineHeight = '30px';
    $('#bottomrightcorner').find('#gamelog-tab-bar').remove();

    let gamelog_tab_bar = $('<div id="gamelog-tab-bar" class="enableclicks" />').css({
      border: '5px solid gray',
      height: '24px',
      background: 'black',
      margin: '-5px 0',
      display: 'flex',
      fontSize: '20px',
      fontFamily: 'pixel'
    });

    let gamelog_tab = $('<div class="gamelog-tab enableclicks" />').css({
      height: '100%',
      width: 'calc(100% / 6)',
      textAlign: 'center',
      lineHeight: '24px',
      cursor: 'default'
    });

    for (let key in gamelog_data) {
      if (!gamelog_data.hasOwnProperty(key)) continue;
      let filter = gamelog_data[key];
      gamelog_tab_bar.append(
        gamelog_tab
        .clone()
        .attr('id', `gamelog-tab-${key}`)
        .css({
          background: gamelog_tab_bar.children().length % 2 == 0 ? filter_colours.on_dark : filter_colours.on_light
        })
        .text(filter.tab_name)
        .click(function() {
          toggle_gamelog_filter(key);
        })
      );
    }
    $('#gamelog').before(gamelog_tab_bar);
  }

  function filter_gamelog() {
    $('.gameentry').each(function() {
      for (let filter of Object.values(gamelog_data)) {
        if (filter.regex.test(this.innerHTML)) {
          this.style.display = filter.show ? 'block' : 'none';
          return;
        }
      }
    });
  }

  function toggle_gamelog_filter(filter) {
    gamelog_data[filter].show = !gamelog_data[filter].show;
    console.log(JSON.stringify(gamelog_data));
    let tab = $(`#gamelog-tab-${filter}`);
    if (gamelog_data[filter].show) {
      tab.css({
        background: $('.gamelog-tab').index(tab) % 2 == 0 ? filter_colours.on_dark : filter_colours.on_light,
        color: filter_colours.on_text
      });
    } else {
      tab.css({
        background: $('.gamelog-tab').index(tab) % 2 == 0 ? filter_colours.off_dark : filter_colours.off_dark,
        color: filter_colours.off_text
      });
    }
    filter_gamelog();
    $("#gamelog").scrollTop($("#gamelog")[0].scrollHeight);
  }

  function pad(num, pad_amount_) {
    pad_amount = pad_amount_ || 2;
    return ("0".repeat(pad_amount) + num).substr(-pad_amount, pad_amount);
  }

  function add_log_filtered(c, a) {
    if (parent.mode.dom_tests || parent.inside == "payments") {
      return;
    }
    if (parent.game_logs.length > 1000) {
      var b = "<div class='gameentry' style='color: gray'>- Truncated -</div>";
      parent.game_logs = parent.game_logs.slice(-720);
      parent.game_logs.forEach(function(d) {
        b += "<div class='gameentry' style='color: " + (d[1] || "white") + "'>" + d[0] + "</div>"
      });
      $("#gamelog").html(b)
    }
    parent.game_logs.push([c, a]);

    let display_mode = 'block';

    for (let filter of Object.values(gamelog_data)) {
      if (filter.regex.test(c)) {
        display_mode = filter.show ? 'block' : 'none';
        break;
      }
    }

    $("#gamelog").append(`<div class='gameentry' style='color: ${a || "white"}; display: ${display_mode};'>${c}</div>`);
    $("#gamelog").scrollTop($("#gamelog")[0].scrollHeight);
  }

  function init_timestamps() {
    if (parent.socket.hasListeners("game_log")) {
      parent.socket.removeListener("game_log");
      parent.socket.on("game_log", data => {
        parent.draw_trigger(function() {
          let now = new Date();
          if (is_string(data)) {
            add_log_filtered(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} | ${data}`, "gray");
          } else {
            if (data.sound) sfx(data.sound);
            add_log_filtered(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} | ${data.message}`, data.color);
          }
        })
      });
    }
  }
}();
