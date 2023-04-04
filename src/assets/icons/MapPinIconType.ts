import * as L from "leaflet";

export enum MapPinIconType {
    PIN,
    CROSSWAY_ICON,
    ALERT_PIN,
    VIEW_PIN,
    RUIN_PIN,
    WATER_PIN,
    START_ICON,
    END_ICON,

    SHALET,
    MONUMENTAL_TREE,
    CAMPING_PIN,

}

export class CrossWayIcon {
    public static get(color = "#888") {
        return L.divIcon({
            html: `
        <g fill="none" fill-rule="evenodd">
        <g fill-rule="nonzero">
            <path fill="` + color + `" d="M26.7090909,0 C26.4727273,0 26.2363636,0 26,0 C11.5818182,0 0,11.6148148 0,26.0740741 C0,45.2740741 20.8,60.9185185 24.3454545,63.2888889 C24.5818182,63.5259259 24.8181818,63.762963 25.0545455,63.762963 C25.2909091,64 25.7636364,64 26.2363636,64 C26.7090909,64 27.1818182,63.762963 27.6545455,63.5259259 C28.3636364,63.0518519 52,46.4592593 52,26.0740741 C52,11.8518519 40.6545455,0.474074074 26.7090909,0 Z"/>
            <path fill="#FFF" d="M26,4.88888889 C14.8318182,4.88888889 6.05681818,13.6888889 6.05681818,24.8888889 C6.05681818,36.0888889 14.8318182,44.8888889 26,44.8888889 C37.1681818,44.8888889 45.9431818,36.0888889 45.9431818,24.8888889 C45.9431818,13.6888889 37.1681818,4.88888889 26,4.88888889 Z"/>
        </g>
        <path fill="` + color + `" fill-rule="nonzero" d="M23.6932681,6.73217177 L23.6932681,11.9821498 C23.6932681,12.4653969 23.2112208,12.8571608 22.6165852,12.8571608 L4.31297481,12.8571608 C4.02678926,12.8584908 3.75172026,12.7671847 3.54852991,12.6033972 L0.318481016,9.97840819 C0.114651311,9.8141131 0,9.59046766 0,9.35716079 C0,9.12385392 0.114651311,8.90020848 0.318481016,8.73591339 L3.54852991,6.11092437 C3.75172026,5.94713686 4.02678926,5.85583077 4.31297481,5.85716079 L22.6165852,5.85716079 C23.2112208,5.85716079 23.6932681,6.24892464 23.6932681,6.73217177 Z M4.30673185,20.0535425 L4.30673185,14.8035645 C4.30673185,14.3203173 4.78877923,13.9285535 5.38341482,13.9285535 L23.6870252,13.9285535 C23.9732107,13.9272235 24.2482797,14.0185296 24.4514701,14.1823171 L27.681519,16.8073061 C27.8853487,16.9716012 28,17.1952466 28,17.4285535 C28,17.6618604 27.8853487,17.8855058 27.681519,18.0498009 L24.4514701,20.6747899 C24.2482797,20.8385774 23.9732107,20.9298835 23.6870252,20.9285535 L5.38341482,20.9285535 C4.78877923,20.9285535 4.30673185,20.5367896 4.30673185,20.0535425 Z M17.2331704,1.07142857 C17.2331704,0.479694911 16.751123,0 16.1564874,0 L10.7730726,0 C10.178437,0 9.69638963,0.479694911 9.69638963,1.07142857 L9.69638963,5.21428571 L17.2331704,5.21428571 L17.2331704,1.07142857 Z M20.4632193,27.8571429 L17.2331704,27.8571429 L17.2331704,21.5714286 L9.69638963,21.5714286 L9.69638963,27.8571429 L6.46634074,27.8571429 C5.87170516,27.8571429 5.38965777,28.3368378 5.38965777,28.9285714 C5.38965777,29.5203051 5.87170516,30 6.46634074,30 L20.4632193,30 C21.0578548,30 21.5399022,29.5203051 21.5399022,28.9285714 C21.5399022,28.3368378 21.0578548,27.8571429 20.4632193,27.8571429 Z" transform="translate(12 9)"/>
        </g>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    }
}

export class WaterIcon {
    public static get(color = "#888") {
        return L.divIcon({
            html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#0B2E20" class="bi bi-signpost-2-fill" viewBox="0 0 64 64">
      <g fill="none" fill-rule="evenodd">
        <g fill-rule="nonzero">
          <path fill="` + color + `" d="M26.7090909,0 C26.4727273,0 26.2363636,0 26,0 C11.5818182,0 0,11.6148148 0,26.0740741 C0,45.2740741 20.8,60.9185185 24.3454545,63.2888889 C24.5818182,63.5259259 24.8181818,63.762963 25.0545455,63.762963 C25.2909091,64 25.7636364,64 26.2363636,64 C26.7090909,64 27.1818182,63.762963 27.6545455,63.5259259 C28.3636364,63.0518519 52,46.4592593 52,26.0740741 C52,11.8518519 40.6545455,0.474074074 26.7090909,0 Z"/>
          <path fill="#FFF" d="M26,4.88888889 C14.8318182,4.88888889 6.05681818,13.6888889 6.05681818,24.8888889 C6.05681818,36.0888889 14.8318182,44.8888889 26,44.8888889 C37.1681818,44.8888889 45.9431818,36.0888889 45.9431818,24.8888889 C45.9431818,13.6888889 37.1681818,4.88888889 26,4.88888889 Z"/>
        </g>
        <path fill="` + color + `" fill-rule="nonzero" d="M10.476796,0.000336905819 C10.2257871,0.00656748412 9.98940776,0.119117699 9.8271532,0.309659356 C9.8271532,0.309659356 7.39556843,3.1911225 4.96170485,6.74390818 C3.74476441,8.52030096 2.52160247,10.4687756 1.59146101,12.3373463 C0.661319551,14.2059177 0,15.9717217 0,17.556522 C0,23.312396 4.70897729,28 10.4974217,28 C16.2858664,28 21,23.312397 21,17.556522 C21,15.971721 20.3318167,14.2059177 19.4016666,12.3373463 C18.4715252,10.4687749 17.2552356,8.52030096 16.0383038,6.74390818 C13.6044312,3.19112267 11.1728468,0.309659356 11.1728468,0.309659356 C11.0001194,0.106779817 10.7440171,-0.0070311243 10.476796,0.000336905819 Z M16.5040477,16.3636076 C16.7727358,16.3664363 17.0254284,16.4911181 17.1901642,16.7022045 C17.3549,16.9132909 17.4136259,17.1876493 17.349618,17.4471484 C17.3226128,17.5638177 17.2907953,17.6793329 17.2585254,17.7889409 C16.5116943,20.3066453 14.8917671,22.3411167 12.8227358,23.6472693 C12.4117476,23.9057808 11.8678288,23.784097 11.6077859,23.3754646 C11.347743,22.9668322 11.4700247,22.4259537 11.8809262,22.1673059 C13.6035073,21.0798623 14.9442998,19.3999936 15.5691105,17.2984682 C15.59126,17.2234578 15.6147964,17.1433346 15.6344184,17.0592133 C15.713538,16.6832154 16.0300095,16.4024892 16.4146795,16.3670824 C16.444391,16.3644417 16.4742184,16.3633048 16.504046,16.3636076 L16.5040477,16.3636076 Z" transform="translate(16 10)"/>
      </g>
    </svg>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    }
}

export class TentIcon {
    public static get(color = "#888") {
        return L.divIcon({
            html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="` + color + `" class="bi bi-signpost-2-fill" viewBox="0 0 64 64">
      <g fill="none" fill-rule="evenodd">
    <g fill-rule="nonzero">
      <path fill="` + color + `" d="M26.7090909,0 C26.4727273,0 26.2363636,0 26,0 C11.5818182,0 0,11.6148148 0,26.0740741 C0,45.2740741 20.8,60.9185185 24.3454545,63.2888889 C24.5818182,63.5259259 24.8181818,63.762963 25.0545455,63.762963 C25.2909091,64 25.7636364,64 26.2363636,64 C26.7090909,64 27.1818182,63.762963 27.6545455,63.5259259 C28.3636364,63.0518519 52,46.4592593 52,26.0740741 C52,11.8518519 40.6545455,0.474074074 26.7090909,0 Z"/>
      <path fill="#FFF" d="M26,4.88888889 C14.8318182,4.88888889 6.05681818,13.6888889 6.05681818,24.8888889 C6.05681818,36.0888889 14.8318182,44.8888889 26,44.8888889 C37.1681818,44.8888889 45.9431818,36.0888889 45.9431818,24.8888889 C45.9431818,13.6888889 37.1681818,4.88888889 26,4.88888889 Z"/>
    </g>
    <path fill="` + color + `" fill-rule="nonzero" d="M22.4733771,5.8627993e-06 L15.0129705,19.9999942 L1.11049168,19.9999942 C0.747055287,20.0011748 0.406194455,19.8231921 0.198518296,19.5237954 C-0.0091578637,19.2243988 -0.0571857925,18.8417394 0.07001954,18.49999 L6.71133107,0.722233145 C6.87344986,0.286670426 7.28860214,-0.00149860841 7.75180321,5.8627993e-06 L22.4733771,5.8627993e-06 Z M22.8939935,19.9999883 L25.8161706,19.9999883 L24.355082,16.3222148 L22.8939935,19.9999883 Z M30.9299805,18.49999 L24.432564,1.11112158 L17.3706361,19.9999942 L20.5031214,19.9999942 L23.3256788,12.9222188 C23.4926519,12.4981304 23.9008068,12.219508 24.355082,12.219508 C24.8093573,12.219508 25.2175121,12.4981304 25.3844853,12.9222188 L28.2070427,19.9999942 L29.8895083,19.9999942 C30.2529447,20.0011748 30.5938055,19.8231921 30.8014817,19.5237954 C31.0091579,19.2243988 31.0571858,18.8417394 30.9299805,18.49999 Z" transform="translate(11 14)"/>
  </g>
    </svg>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    }
}

export class MonumentalTreeIcon {
    public static get(color = "#888") {
        return L.divIcon({
            html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="` + color + `" class="bi bi-signpost-2-fill" viewBox="0 0 64 64">
      <g fill="none" fill-rule="evenodd">
    <g fill-rule="nonzero">
      <path fill="` + color + `" d="M26.7090909,0 C26.4727273,0 26.2363636,0 26,0 C11.5818182,0 0,11.6148148 0,26.0740741 C0,45.2740741 20.8,60.9185185 24.3454545,63.2888889 C24.5818182,63.5259259 24.8181818,63.762963 25.0545455,63.762963 C25.2909091,64 25.7636364,64 26.2363636,64 C26.7090909,64 27.1818182,63.762963 27.6545455,63.5259259 C28.3636364,63.0518519 52,46.4592593 52,26.0740741 C52,11.8518519 40.6545455,0.474074074 26.7090909,0 Z"/>
      <path fill="#FFF" d="M26,4.88888889 C14.8318182,4.88888889 6.05681818,13.6888889 6.05681818,24.8888889 C6.05681818,36.0888889 14.8318182,44.8888889 26,44.8888889 C37.1681818,44.8888889 45.9431818,36.0888889 45.9431818,24.8888889 C45.9431818,13.6888889 37.1681818,4.88888889 26,4.88888889 Z"/>
    </g>
    <path fill="` + color + `" fill-rule="nonzero" d="M25.8491097,17.2305529 C25.6760821,17.4865565 25.3870965,17.6397639 25.0781184,17.6392984 L19.5046867,17.6392984 L19.5046867,24.1420663 L20.433592,24.1420663 C20.9466122,24.1420663 21.3624973,24.5579789 21.3624973,25.0710332 C21.3624973,25.5840874 20.9466122,26 20.433592,26 L16.7179709,26 C16.2049507,26 15.7890657,25.5840874 15.7890657,25.0710332 C15.7890657,24.5579789 16.2049507,24.1420663 16.7179709,24.1420663 L17.6468762,24.1420663 L17.6468762,17.6392984 L15.5289722,17.6392984 C15.820483,17.1424925 15.8650883,16.5385643 15.6497299,16.0043167 L13.5039587,10.8021024 L17.7211886,0.583467023 C17.8671087,0.240907401 18.2034587,0.018579337 18.5757815,0.018579337 C18.9481042,0.018579337 19.2844542,0.240907401 19.4303743,0.583467023 L25.9327112,16.3759034 C26.0460802,16.6573452 26.0148686,16.976419 25.8491097,17.2305529 Z M8.2835111,0.564887686 C8.13759098,0.222328064 7.80124098,0 7.42891825,0 C7.05659552,0 6.72024552,0.222328064 6.5743254,0.564887686 L0.0719885236,16.3573241 C-0.0479751559,16.6440579 -0.0165983428,16.971793 0.155589998,17.2305529 C0.32861759,17.4865565 0.617603251,17.6397639 0.926581371,17.6392984 L6.50001298,17.6392984 L6.50001298,24.1420663 L5.57110771,24.1420663 C5.0580875,24.1420663 4.64220244,24.5579789 4.64220244,25.0710332 C4.64220244,25.5840874 5.0580875,26 5.57110771,26 L9.28672879,26 C9.799749,26 10.2156341,25.5840874 10.2156341,25.0710332 C10.2156341,24.5579789 9.799749,24.1420663 9.28672879,24.1420663 L8.35782352,24.1420663 L8.35782352,17.6392984 L13.9312551,17.6392984 C14.2402332,17.6397639 14.5292189,17.4865565 14.7022465,17.2305529 C14.8744348,16.971793 14.9058117,16.6440579 14.785848,16.3573241 L8.2835111,0.564887686 Z" transform="translate(13 11)"/>
  </g>
    </svg>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    }
}

export class ShaletIcon {
    public static get(color = "#888") {
        return L.divIcon({
            html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#0B2E20" class="bi bi-signpost-2-fill" viewBox="0 0 64 64">
      <g fill="none" fill-rule="evenodd">
    <g fill="none" fill-rule="evenodd">
    <g fill-rule="nonzero">
   <path d="m26.709 0h-0.70909c-14.418 0-26 11.615-26 26.074 0 19.2 20.8 34.844 24.345 37.215 0.23636 0.23704 0.47273 0.47407 0.70909 0.47407 0.23636 0.23704 0.70909 0.23704 1.1818 0.23704 0.47273 0 0.94545-0.23704 1.4182-0.47407 0.70909-0.47407 24.345-17.067 24.345-37.452 0-14.222-11.345-25.6-25.291-26.074z" fill="` + color + `"/>
   <path d="m26 4.8889c-11.168 0-19.943 8.8-19.943 20s8.775 20 19.943 20 19.943-8.8 19.943-20-8.775-20-19.943-20z" fill="#FFF"/>
    </g>
    <g transform="translate(9 12)">
   <path d="m11.03 8.8532c1.4783 1.1942 2.3884 2.9389 2.5224 4.8334l1.4429 0.029067-3.2639-6.0901-0.7014 1.2277zm-5.0009 6.06c-0.030939-0.044114-0.049299-0.093016-0.070038-0.14089-0.10506-0.23835-0.095197-0.51398 0.050998-0.77182l2.5282-4.4227c-0.55996-0.21749-1.1478-0.32761-1.7496-0.32761-2.6982 0-4.8935 2.2081-4.8938 4.9226 3.3999e-4 2.7139 2.1957 4.9213 4.8938 4.9213 2.2001 0 4.1486-1.5156 4.7208-3.6365l-4.7245-0.094384c-0.32979-0.0075233-0.60518-0.17133-0.7558-0.45003z"/>
   <path d="m10.073 10.527-1.7458 3.0548 3.3214 0.067026c-0.1275-1.1962-0.69154-2.3138-1.5755-3.1218z"/>
   <polygon points="16.573 12.843 20.462 6.931 13.404 6.931"/>
   <path d="m27.21 9.1343c-0.62184 0-1.2311 0.11935-1.8125 0.35462l2.5914 4.6084c0.16014 0.2852 0.16286 0.60323 0.0071398 0.87271-0.17067 0.29375-0.49741 0.48389-0.8323 0.48389h-3.4e-4c-0.30565 0-0.5722-0.16278-0.732-0.44695l-2.5557-4.5455c-0.99379 0.93221-1.5589 2.2296-1.5589 3.5951 0 2.7139 2.1953 4.922 4.8935 4.922 2.6985 0 4.8938-2.2081 4.8938-4.922-3.4e-4 -2.7139-2.1957-4.9223-4.8942-4.9223z"/>
  </g>
 </g>
    <g fill="` + color + `">
  <path d="m35.826 13.88-8.4111 10.1h-15.674c-0.40975 6.06e-4 -0.79405-0.08928-1.0282-0.24048-0.23414-0.15119-0.28829-0.34444-0.14487-0.51702l7.4877-8.9777c0.18278-0.21996 0.65084-0.36548 1.1731-0.36472z" stroke-width=".75455"/>
  <path d="m33.235 13.927 5.8187 6.4764 1.1391 0.07196c0.27617 3.93e-4 0.53519-0.05789 0.693-0.15592 0.15781-0.09803 0.19431-0.22332 0.09764-0.33521l-5.0467-5.8208c-0.12319-0.14261-0.43867-0.23696-0.79065-0.23647z" stroke-width=".4988"/>
  <rect x="15.383" y="17.645" width="16.87" height="16.204"/>
  <path d="m37.469 17.643-0.11056 16.111" stroke="` + color + `" stroke-width="1.0466px"/>
 </g>
    </svg>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    }
}

export class RuinIcon {
    public static get(color = "#888") {
        return L.divIcon({
            html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="` + color + `" class="bi bi-signpost-2-fill" viewBox="0 0 64 64">
      <g fill="none" fill-rule="evenodd">
      <g fill-rule="nonzero">
        <path fill="` + color + `" d="M26.7090909,0 C26.4727273,0 26.2363636,0 26,0 C11.5818182,0 0,11.6148148 0,26.0740741 C0,45.2740741 20.8,60.9185185 24.3454545,63.2888889 C24.5818182,63.5259259 24.8181818,63.762963 25.0545455,63.762963 C25.2909091,64 25.7636364,64 26.2363636,64 C26.7090909,64 27.1818182,63.762963 27.6545455,63.5259259 C28.3636364,63.0518519 52,46.4592593 52,26.0740741 C52,11.8518519 40.6545455,0.474074074 26.7090909,0 Z"/>
        <path fill="#FFF" d="M26,4.88888889 C14.8318182,4.88888889 6.05681818,13.6888889 6.05681818,24.8888889 C6.05681818,36.0888889 14.8318182,44.8888889 26,44.8888889 C37.1681818,44.8888889 45.9431818,36.0888889 45.9431818,24.8888889 C45.9431818,13.6888889 37.1681818,4.88888889 26,4.88888889 Z"/>
      </g>
      <path fill="` + color + `" fill-rule="nonzero" d="M24.5911302,4.21205594 C24.5911302,4.66723077 24.2180712,5.03909091 23.7626148,5.03909091 C23.3071585,5.03909091 22.9785421,5.4086993 23.0333656,5.86033566 L24.9911143,22.181972 C25.0582649,22.6316783 24.7374342,23 24.2784094,23 L17.7287912,23 C17.269442,23 16.6553545,23 16.3646929,23 C16.0733825,23 15.8346247,22.6281399 15.8346247,22.172965 L15.8346247,21.4848951 C15.8346247,21.030042 15.6811839,20.3181678 15.4940056,19.9032028 C15.4940056,19.9032028 14.4121346,17.5086294 12.6564865,17.5086294 C10.9008385,17.5086294 9.81896743,19.9032028 9.81896743,19.9032028 C9.63146474,20.3181678 9.47802396,21.0303636 9.47802396,21.4848951 L9.47802396,22.172965 C9.47802396,22.6281399 9.239915,23 8.94860459,23 C8.65729418,23 8.04320665,23 7.58450629,23 L0.721842907,23 C0.262493753,23 -0.0580125775,22.6316783 0.00881364122,22.181972 L1.96591353,5.86033566 C2.02073698,5.4086993 1.68984988,5.03941259 1.23114953,5.03941259 L1.13934457,5.03941259 C0.68031982,5.03941259 0.304665639,4.66723077 0.304665639,4.2126993 L0.304665639,0.827356643 C0.304665639,0.372181818 0.68031982,0 1.13934457,0 L5.28581413,0 C5.74483888,0 6.12049307,0.372181818 6.12049307,0.827356643 L6.12049307,1.69267133 C6.12049307,2.14784615 6.49614725,2.51970629 6.955172,2.51970629 L7.90047104,2.51970629 C8.35982019,2.51970629 8.73514997,2.14752448 8.73514997,1.69267133 L8.73514997,0.827356643 C8.73514997,0.372181818 9.11080415,0 9.56982891,0 L10.5151279,0 C10.9744771,0 11.3498069,0.372181818 11.3498069,0.827356643 L11.3498069,1.69267133 C11.3498069,2.14784615 11.7254611,2.51970629 12.1844858,2.51970629 L13.1294605,2.51970629 C13.5884852,2.51970629 13.9641394,2.14752448 13.9641394,1.69267133 L13.9641394,0.827356643 C13.9641394,0.372181818 14.3394692,0 14.7984939,0 L15.7441174,0 C16.2031421,0 16.5784719,0.372181818 16.5784719,0.827356643 L16.5784719,1.69267133 C16.5784719,2.14784615 16.9538017,2.51970629 17.4131508,2.51970629 L18.3581255,2.51970629 C18.8174746,2.51970629 19.1928044,2.14752448 19.1928044,1.69267133 L19.1928044,0.827356643 C19.1928044,0.372181818 19.5684586,0 20.0274833,0 L23.7571,0 C24.2161248,0 24.591779,0.372181818 24.591779,0.827356643 L24.591779,4.21205594 L24.5911302,4.21205594 Z" transform="translate(14 13)"/>
    </g>
    </svg>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    }
}

export class ViewPinIcon {
    public static get(color = "#888") {
        return L.divIcon({
            html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="` + color + `" class="bi bi-signpost-2-fill" viewBox="0 0 64 64">
        <g fill="none" fill-rule="evenodd">
    <g fill-rule="nonzero">
      <path fill="` + color + `" d="M26.7090909,0 C26.4727273,0 26.2363636,0 26,0 C11.5818182,0 0,11.6148148 0,26.0740741 C0,45.2740741 20.8,60.9185185 24.3454545,63.2888889 C24.5818182,63.5259259 24.8181818,63.762963 25.0545455,63.762963 C25.2909091,64 25.7636364,64 26.2363636,64 C26.7090909,64 27.1818182,63.762963 27.6545455,63.5259259 C28.3636364,63.0518519 52,46.4592593 52,26.0740741 C52,11.8518519 40.6545455,0.474074074 26.7090909,0 Z"/>
      <path fill="#FFF" d="M26,4.88888889 C14.8318182,4.88888889 6.05681818,13.6888889 6.05681818,24.8888889 C6.05681818,36.0888889 14.8318182,44.8888889 26,44.8888889 C37.1681818,44.8888889 45.9431818,36.0888889 45.9431818,24.8888889 C45.9431818,13.6888889 37.1681818,4.88888889 26,4.88888889 Z"/>
    </g>
    <path fill="` + color + `" fill-rule="nonzero" d="M30.8864,11.5014209 L24.5674667,1.89993342 L24.5667556,1.90029068 C23.8129778,0.755257474 22.5208889,0 21.0524444,0 C18.7271111,0 16.8423111,1.89421718 16.8423111,4.23072801 C16.8423111,4.44723039 16.8583111,4.66051738 16.8896,4.86844541 L16.8906667,4.87523344 L16.9208889,5.07708797 L15.0791111,5.07708797 L15.1093333,4.87523344 L15.1104,4.86844541 C15.1416889,4.66051738 15.1576889,4.44758765 15.1576889,4.23072801 C15.1576889,1.89385992 13.2728889,0 10.9475556,0 C9.47911111,0 8.18702222,0.755614739 7.43324444,1.90029068 L7.43253333,1.89993342 L1.1136,11.5014209 L1.11466667,11.5017782 C0.411022222,12.5710713 0,13.8522223 0,15.2305494 C0,18.969324 3.01617778,22 6.73671111,22 C10.112,22 12.9073778,19.5055782 13.3973333,16.2508972 L13.3976889,16.2508972 L13.6963556,14.2630767 C14.2848,14.8597087 15.0997333,15.2305494 16,15.2305494 C16.9002667,15.2305494 17.7148444,14.8597087 18.3032889,14.2630767 L18.6023111,16.2508972 L18.6026667,16.2508972 C19.0926222,19.5055782 21.888,22 25.2632889,22 C28.9838222,22 32,18.969324 32,15.2305494 C32,13.8525796 31.5889778,12.5714286 30.8853333,11.5017782 L30.8864,11.5014209 Z M6.73671111,19.6306208 C4.32248889,19.6306208 2.35768889,17.6567336 2.35768889,15.2305494 C2.35768889,12.8043651 4.32248889,10.8308352 6.73671111,10.8308352 C9.15128889,10.8308352 11.1157333,12.8047224 11.1157333,15.2305494 C11.1160889,17.6567336 9.15128889,19.6306208 6.73671111,19.6306208 Z M16,13.5381867 C15.1388444,13.5381867 14.4405333,12.8368762 14.4405333,11.971224 C14.4405333,11.105929 15.1388444,10.4042612 16,10.4042612 C16.8611556,10.4042612 17.5594667,11.105929 17.5594667,11.971224 C17.5594667,12.8368762 16.8611556,13.5381867 16,13.5381867 Z M25.2632889,19.6306208 C22.8487111,19.6306208 20.8842667,17.6567336 20.8842667,15.2305494 C20.8842667,12.8043651 22.8487111,10.8308352 25.2632889,10.8308352 C27.6778667,10.8308352 29.6423111,12.8047224 29.6423111,15.2305494 C29.6423111,17.6567336 27.6778667,19.6306208 25.2632889,19.6306208 Z" transform="translate(10 13)"/>
    </g>
    </svg>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });
    }
}


export class PinIcon {
    public static get(color = "#D04341") {
        return L.divIcon({
            html: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="32" viewBox="0 0 52 64">
        <g fill="none">
          <path fill="` + color + `" d="M26.7090909,0 C26.4727273,0 26.2363636,0 26,0 C11.5818182,0 0,11.6148148 0,26.0740741 C0,45.2740741 20.8,60.9185185 24.3454545,63.2888889 C24.5818182,63.5259259 24.8181818,63.762963 25.0545455,63.762963 C25.2909091,64 25.7636364,64 26.2363636,64 C26.7090909,64 27.1818182,63.762963 27.6545455,63.5259259 C28.3636364,63.0518519 52,46.4592593 52,26.0740741 C52,11.8518519 40.6545455,0.474074074 26.7090909,0 Z"/>
          <path fill="#FFF" d="M26,13.037037 C19.3818182,13.037037 14.1818182,18.2518519 14.1818182,24.8888889 C14.1818182,31.5259259 19.3818182,36.7407407 26,36.7407407 C32.6181818,36.7407407 37.8181818,31.5259259 37.8181818,24.8888889 C37.8181818,18.2518519 32.6181818,13.037037 26,13.037037 Z"/>
        </g>
      </svg>
      `,
            className: "",
            iconSize: [26, 32],
            iconAnchor: [16, 32],
        });
    }
}

export class AlertPinIcon {
    public static get() {
        return L.divIcon({
            html: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="32" viewBox="0 0 52 64">
        <g fill="none" fill-rule="evenodd">
          <g fill-rule="nonzero">
            <path fill="#ECC333" d="M26.7090909,0 C26.4727273,0 26.2363636,0 26,0 C11.5818182,0 0,11.6148148 0,26.0740741 C0,45.2740741 20.8,60.9185185 24.3454545,63.2888889 C24.5818182,63.5259259 24.8181818,63.762963 25.0545455,63.762963 C25.2909091,64 25.7636364,64 26.2363636,64 C26.7090909,64 27.1818182,63.762963 27.6545455,63.5259259 C28.3636364,63.0518519 52,46.4592593 52,26.0740741 C52,11.8518519 40.6545455,0.474074074 26.7090909,0 Z"/>
            <path fill="#FFF" d="M26,4.88888889 C14.8318182,4.88888889 6.05681818,13.6888889 6.05681818,24.8888889 C6.05681818,36.0888889 14.8318182,44.8888889 26,44.8888889 C37.1681818,44.8888889 45.9431818,36.0888889 45.9431818,24.8888889 C45.9431818,13.6888889 37.1681818,4.88888889 26,4.88888889 Z"/>
          </g>
          <path fill="#ECC333" fill-rule="nonzero" d="M17.2765096,1.87190854 C16.6006218,0.713557358 15.35164,0 14,0 C12.6483538,0 11.399372,0.713557358 10.7234841,1.87190854 L0.506793274,19.3839992 C-0.168968305,20.5424138 -0.168928597,21.9695931 0.506897442,23.1279709 C1.18272348,24.2863487 2.43167055,25 3.78330602,25 L24.216694,25 C25.5683294,25 26.8172765,24.2863487 27.4931026,23.1279709 C28.1689286,21.9695931 28.1689683,20.5424138 27.4932067,19.3839992 L17.2765096,1.87190854 Z M13.9999969,21.9676306 C13.1940115,21.9676306 12.5406399,21.3210335 12.5406399,20.5234265 C12.5406399,19.7258196 13.1940281,19.0792388 14.0000135,19.0792388 C14.8059988,19.0792388 15.4593725,19.7258339 15.4593725,20.5234409 C15.4593725,20.9064665 15.3056168,21.2738041 15.0319304,21.5446427 C14.7582439,21.8154812 14.3870459,21.9676306 13.9999969,21.9676306 L13.9999969,21.9676306 Z M16.06044,7.4767531 L15.5450126,16.1481903 C15.496893,16.9577671 14.8194357,17.589907 13.9999409,17.589907 C13.180446,17.589907 12.5029887,16.9577671 12.4548692,16.1481903 L11.9394199,7.4767531 C11.8944135,6.71964287 12.2770051,6.00018466 12.9330825,5.60818408 C13.5891599,5.21618351 14.4107,5.21618351 15.0667774,5.60818408 C15.7228549,6.00018466 16.1054464,6.71964287 16.06044,7.4767531 Z" transform="translate(12 10)"/>
        </g>
      </svg>
      `,
            className: "",
            iconSize: [26, 32],
            iconAnchor: [16, 32],
        });
    }
}

export class StartIcon {
    public static get() {
        return L.divIcon({
            html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      </svg>`,
            className: "",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });
    }
}

export class EndIcon {
    public static get() {
        return L.divIcon({
            html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-circle-fill" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="8"/>
  </svg>`,
            className: "",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });
    }
}
