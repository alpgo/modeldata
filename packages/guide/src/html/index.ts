const html = `
<div id="guide">
    <div class="light"></div>
</div>
`;

const style = `
    #guide {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
    }

    #guide .light {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        box-shadow: 0 0 0 2000px rgba(0, 0, 0, 0.5);
    }
`;

let container: HTMLElement;
let light: HTMLElement;
let styleHtml: HTMLElement;
let currentData: MsgType;
let isInit: boolean = false;

export function init()
{
    isInit = true;
    container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    light = container.querySelector('.light');

    styleHtml = document.createElement('style');
    styleHtml.textContent = style;
    document.head.appendChild(styleHtml);

    light.addEventListener('click', function (e)
    {
        // 为了避免出现错误, 导致卡死, 如何出现了错误, 那么删除引导层
        try {
            handleEvent(e);
        } catch (err) {
            console.log(err);
            remove();
        }
    }, false);
    light.style.display = 'none';
}

function show()
{
    if (!isInit) {
        init();
    }
    light.style.display = "block";
}

function hide()
{
    light.style.display = "none";
}

function remove()
{
    container.style.display = 'none';
}

function updatePosition(posX: number, posY: number)
{
    light.style.left = posX + 'px';
    light.style.top = posY + 'px';
}

function handleEvent(e: Event)
{
    if (!currentData) {
        console.warn('currentData undefined');
        return;
    }
    if (e.type == currentData.eventType) {
        const data = currentData.eventHandler(e);
        if (data && data.guideOver) {
            hide();
        }
    } else { }
}

export interface MsgType
{
    pageX: number;
    pageY: number;
    eventType: string;
    eventHandler: (e: Event) => any;
}

export function step(data: MsgType)
{
    if (data.eventHandler == null) {
        currentData = null;
        remove();
        return;
    }
    currentData = data;
    //TODO: showGuide() ?
    show();
    updatePosition(data.pageX - 50, data.pageY - 50);
}