// 设备信息数据库
const deviceDatabase = {
    // 摄像头设备
    'camera-4f-left': {
        name: '网络摄像头 - 4F左侧',
        type: '安防监控设备',
        description: '高清网络摄像头，用于4层左侧区域监控。支持夜视功能，具备移动侦测和智能分析能力。',
        specifications: {
            '分辨率': '1920×1080 (2MP)',
            '视角': '水平80°，垂直45°',
            '夜视距离': '30米',
            '压缩格式': 'H.264/H.265',
            '网络接口': 'RJ45 10/100M',
            '供电方式': 'PoE或12V直流',
            '工作温度': '-10°C ~ +55°C',
            '防护等级': 'IP66'
        },
        wiring: ['支RVV', 'PD供电'],
        status: '在线',
        location: '4F左侧'
    },
    
    'camera-4f-right': {
        name: '网络摄像头 - 4F右侧',
        type: '安防监控设备',
        description: '高清网络摄像头，用于4层右侧区域监控。配备红外补光灯和智能警戒功能。',
        specifications: {
            '分辨率': '1920×1080 (2MP)',
            '视角': '水平80°，垂直45°',
            '夜视距离': '30米',
            '压缩格式': 'H.264/H.265',
            '网络接口': 'RJ45 10/100M',
            '供电方式': 'PoE或12V直流',
            '工作温度': '-10°C ~ +55°C',
            '防护等级': 'IP66'
        },
        wiring: ['支RVV', 'PD供电'],
        status: '在线',
        location: '4F右侧'
    },
    
    // 控制器设备
    'controller-4f': {
        name: '消防控制器 - 4F',
        type: '消防系统控制设备',
        description: '智能消防控制器，负责4层消防设备的集中控制和监管。具备自动报警、联动控制等功能。',
        specifications: {
            '输入电压': 'AC220V/DC24V',
            '功耗': '≤50W',
            '监控点数': '128点',
            '通信接口': 'RS485',
            '显示方式': 'LCD液晶显示',
            '报警音量': '≥85dB',
            '工作环境': '0°C~40°C，≤95%RH',
            '响应时间': '≤3秒'
        },
        wiring: ['支测器', 'RS485', 'PD供电'],
        status: '正常',
        location: '4F控制室'
    },
    
    // 声光报警器
    'sensor-4f-green': {
        name: '声光报警器 - 4F',
        type: '声光报警设备',
        description: '智能声光报警器，当检测到火灾信号时发出声音和光线警报，有效提醒人员疏散。',
        specifications: {
            '工作电压': 'DC24V',
            '声音输出': '≥100dB(1m)',
            '光源类型': 'LED频闪',
            '频闪频率': '1Hz',
            '功耗': '≤5W',
            '响应时间': '≤1秒',
            '工作温度': '-10°C ~ +55°C',
            '防护等级': 'IP54'
        },
        wiring: ['RAVV', '声光', 'PD供电'],
        status: '待机',
        location: '4F'
    },
    
    // 手动报警器
    'alarm-4f': {
        name: '手动火灾报警按钮 - 4F',
        type: '手动报警设备',
        description: '手动火灾报警按钮，人员发现火灾时可手动触发报警信号，启动消防联动系统。',
        specifications: {
            '工作电压': 'DC24V',
            '接点容量': 'DC24V 0.1A',
            '动作方式': '按压式',
            '复位方式': '专用钥匙复位',
            '外壳材料': '阻燃ABS',
            '防护等级': 'IP44',
            '工作温度': '-10°C ~ +55°C',
            '安装高度': '1.3-1.5米'
        },
        wiring: ['手报', 'PD供电'],
        status: '待机',
        location: '4F'
    }
};

// DOM 元素
const deviceInfoPanel = document.getElementById('deviceInfoPanel');
const deviceTitle = document.getElementById('deviceTitle');
const deviceDetails = document.getElementById('deviceDetails');
const deviceSpecs = document.getElementById('deviceSpecs');
const closeInfoBtn = document.getElementById('closeInfoBtn');

let currentDevice = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeParticleSystem();
    initializeDeviceInteractions();
    console.log('智慧建筑系统已初始化');
});

// 初始化粒子系统
function initializeParticleSystem() {
    const particleSystem = document.getElementById('particleSystem');
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (20 + Math.random() * 10) + 's';
        
        const size = 1 + Math.random() * 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particleSystem.appendChild(particle);
    }
}

// 初始化设备交互
function initializeDeviceInteractions() {
    document.querySelectorAll('.device').forEach(device => {
        device.addEventListener('click', function(e) {
            e.stopPropagation();
            const deviceId = this.getAttribute('data-device');
            showDeviceInfo(deviceId);
            
            // 添加点击效果
            this.style.transform = 'scale(1.2) translateZ(15px)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
        
        device.addEventListener('mouseenter', function() {
            this.style.filter = 'drop-shadow(0 0 10px rgba(52, 152, 219, 0.8))';
            createHoverParticles(this);
        });
        
        device.addEventListener('mouseleave', function() {
            this.style.filter = '';
        });
    });
    
    // 关闭信息面板
    closeInfoBtn.addEventListener('click', closeDeviceInfo);
    deviceInfoPanel.addEventListener('click', function(e) {
        if (e.target === deviceInfoPanel) {
            closeDeviceInfo();
        }
    });
}

// 显示设备信息
function showDeviceInfo(deviceId) {
    const device = deviceDatabase[deviceId];
    if (!device) {
        // 如果没有找到设备，创建默认信息
        const defaultDevice = {
            name: `设备 ${deviceId}`,
            type: '智能建筑设备',
            description: '这是一个智能建筑系统中的重要设备，负责监控和控制相关功能。',
            specifications: {
                '设备编号': deviceId,
                '状态': '正常运行',
                '通信协议': 'RS485',
                '供电方式': 'DC24V'
            },
            wiring: ['数据线', '电源线'],
            status: '在线',
            location: '建筑内部'
        };
        
        displayDeviceInfo(defaultDevice, deviceId);
    } else {
        displayDeviceInfo(device, deviceId);
    }
}

function displayDeviceInfo(device, deviceId) {
    currentDevice = deviceId;
    
    deviceTitle.textContent = device.name;
    
    deviceDetails.innerHTML = `
        <div class="device-header">
            <h4>设备类型：${device.type}</h4>
            <div class="status-badge status-online">${device.status}</div>
        </div>
        <p>${device.description}</p>
        <div class="device-meta">
            <span class="location"><strong>位置：</strong>${device.location}</span>
            <span class="wiring"><strong>接线：</strong>${device.wiring.join(', ')}</span>
        </div>
    `;
    
    let specsHTML = '<h4>技术参数</h4>';
    for (const [key, value] of Object.entries(device.specifications)) {
        specsHTML += `
            <div class="spec-item">
                <span class="spec-label">${key}:</span>
                <span class="spec-value">${value}</span>
            </div>
        `;
    }
    deviceSpecs.innerHTML = specsHTML;
    
    deviceInfoPanel.classList.add('active');
}

// 关闭设备信息
function closeDeviceInfo() {
    deviceInfoPanel.classList.remove('active');
    currentDevice = null;
}

// 创建悬停粒子效果
function createHoverParticles(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 3; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(52, 152, 219, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        particle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(particle);
        
        particle.animate([
            { transform: 'scale(0) translateY(0px)', opacity: 1 },
            { transform: 'scale(1) translateY(-20px)', opacity: 0.7 },
            { transform: 'scale(0) translateY(-40px)', opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'ease-out'
        }).addEventListener('finish', () => {
            particle.remove();
        });
    }
}

// 添加额外样式
const additionalStyles = `
.device-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    font-weight: bold;
}

.status-badge.status-online {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.device-meta {
    display: flex;
    gap: 20px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #e9ecef;
    font-size: 0.9em;
}

.device-meta span {
    color: #6c757d;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

console.log('智慧建筑系统交互脚本已加载');