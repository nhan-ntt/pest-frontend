import React from "react";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import "./style.scss"
import { ToAbsoluteUrl } from '../../common-library/helpers/assets-helpers';

const DEMO_FORECAST_LIST_IMAGE = ToAbsoluteUrl("/media/aboutpage/demo_forecast_list.png");
const DEMO_FORECAST_DETAIL_IMAGE = ToAbsoluteUrl("/media/aboutpage/demo_forecast_detail.png");
const WEATHER_FORECAST_IMAGE = ToAbsoluteUrl("/media/aboutpage/weather_forecast.png");
const DEMO_MOBILE_IMAGE = ToAbsoluteUrl("/media/aboutpage/demo_mobile.png");
const USER_AVATAR_IMAGE = ToAbsoluteUrl("/media/aboutpage/user_avatar.png");
const HVNNVN_LOGO_IMAGE = ToAbsoluteUrl("/media/aboutpage/hvnnvn_logo.png");
const UET_LOGO_IMAGE = ToAbsoluteUrl("/media/aboutpage/uet_logo.png");
const ARTICLE_PAGE_1_IMAGE = ToAbsoluteUrl("/media/aboutpage/article_page_1.png");

const LEARN_MORE_SVG_PATH = <path d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01" />
const AFFC_LOGO_1_PATH = <path d="M21 6v4.5c0 .55-.45 1-1 1h-9.67c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1H20c.55 0 1 .45 1 1m-6.33 12v-4.5c0-.55-.45-1-1-1h-3.33c-.55 0-1 .45-1 1V18c0 .55.45 1 1 1h3.33c.55 0 1-.45 1-1m1-4.5V18c0 .55.45 1 1 1H20c.55 0 1-.45 1-1v-4.5c0-.55-.45-1-1-1h-3.33c-.56 0-1 .45-1 1M8.33 18V6c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h3.33c.56 0 1-.45 1-1" />;
const AFFC_LOGO_2_PATH = <path d="M4 7c0-.55.45-1 1-1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-1.1 0-2 .9-2 2v11h-.5c-.83 0-1.5.67-1.5 1.5S.67 20 1.5 20H14v-3H4zm19 1h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1m-1 9h-4v-7h4z"/>;
const AFFC_LOGO_3_PATH = <path d="M4 7c.55 0 1 .45 1 1v5c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1m-3 3c.55 0 1 .45 1 1v5c0 .55-.45 1-1 1s-1-.45-1-1v-5c0-.55.45-1 1-1m22-3c.55 0 1 .45 1 1v5c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1m-3 3c.55 0 1 .45 1 1v5c0 .55-.45 1-1 1s-1-.45-1-1v-5c0-.55.45-1 1-1m-4-7.99L8 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-1.99-2-1.99M16 17H8V7h8z"/>;


interface Author {
    name: string;
    organization: string;
    org_logo: any;
  }
  
  const authors: Author[] = [
    {
      name: 'Hoàng Thị Điệp*',
      organization: 'Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội,',
      org_logo: UET_LOGO_IMAGE,
    },
    {
      name: 'Nguyễn Thị Ánh Dương',
      organization: 'Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội',
      org_logo: UET_LOGO_IMAGE,
    },
    {
      name: 'Nguyễn Kiến Thái Dương',
      organization: 'Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội',
      org_logo: UET_LOGO_IMAGE,
    },
    {
      name: 'Nguyễn Duy Vũ',
      organization: 'Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội',
      org_logo: UET_LOGO_IMAGE,
    },
    {
      name: 'Lưu Thị Quỳnh Trang',
      organization: 'Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội',
      org_logo: UET_LOGO_IMAGE,
    },
    {
      name: 'Trần Thị Thu Phương',
      organization: 'Học viện Nông nghiệp Việt Nam',
      org_logo: HVNNVN_LOGO_IMAGE,
    },
    {
      name: 'Phạm Minh Triển*',
      organization: 'Trường Đại học Công nghệ, Đại học Quốc gia Hà Nội',
      org_logo: UET_LOGO_IMAGE,
    },
  ];
  
export default function AboutPage() {
    const userInfo = useSelector(({ auth }: any) => auth);
    const [afSelected, setAfSelected] = React.useState(1);

    const isLoggedInAndUnexpired = () => {
        const unexpired = () => {
          const expiredTime = new Date(userInfo._certificate.certificateInfo.timestamp);
          expiredTime.setSeconds(expiredTime.getSeconds() + userInfo._certificate.certificateInfo.exp);
          return expiredTime.getTime() > new Date().getTime();
        };

        return userInfo._certificate && !userInfo._preLoggedIn && unexpired();
      };

    const getImageAfSelected = () => {
        switch (afSelected) {
            case 1:
                return WEATHER_FORECAST_IMAGE;
            case 2:
                return DEMO_FORECAST_DETAIL_IMAGE;
            case 3:
                return DEMO_MOBILE_IMAGE;
            default:
                return DEMO_FORECAST_LIST_IMAGE;
        }
    }
    
    return (
        <div className="about-background">
            <div className="about-page">
                <div className="about-intro">
                    <h1 className="ai-title">
                        <b>About <span>iFAWcast</span></b>
                    </h1>
                    <p className="ai-summary">
                        Hệ thống iFAWcast là một ứng dụng đột phá trong việc dự báo và thu thập dữ liệu về sâu keo mùa thu trên cây ngô,
                        một vấn đề đang gây ra thách thức đối với nông nghiệp trên toàn cầu.
                    </p>
                    {!isLoggedInAndUnexpired() && <div className="ai-login">
                        <Link to="/auth/login">
                            <button tabIndex={0} type="button" className="ai-button">
                                Bắt đầu ngay
                            </button>
                        </Link>
                    </div>}
                </div>
                <div className="demo-image">
                    <img src={`${DEMO_FORECAST_LIST_IMAGE}`} />    
                </div>
                <div className="about-function">
                    <div className="af-feature">
                        <div className="aff-description">
                            <h2>Tính năng</h2>
                            <p>
                                Được phát triển dựa trên nền tảng web và di động, iFAWcast tự động cung cấp dự báo, cảnh báo và quản lý thông tin liên
                                quan đến sự xuất hiện của sâu keo mùa thu, giúp người nông dân và các chuyên gia nông nghiệp có thể phòng trừ dịch bệnh
                                một cách hiệu quả hơn.
                            </p>
                        </div>
                        <AFFChild
                            isOn={afSelected === 1}
                            onClick={() => { setAfSelected(1) }}
                            logoPath={AFFC_LOGO_1_PATH}
                            title="Tính toán"
                            description="iFAWcast tự động cung cấp dự báo, cảnh báo và quản lý thông tin liên quan đến sự xuất hiện của sâu keo mùa thu"
                        />
                        <AFFChild
                            isOn={afSelected === 2}
                            onClick={() => { setAfSelected(2) }}
                            logoPath={AFFC_LOGO_2_PATH}
                            title="Thông tin dự báo"
                            description="Hệ thống sẽ đưa ra các thông tin dự báo về tình trạng của cây trồng và sâu keo mùa thu theo ngày cho các chuyên gia
                            trên nền tảng web"
                        />
                        <AFFChild
                            isOn={afSelected === 3}
                            onClick={() => { setAfSelected(3) }}
                            logoPath={AFFC_LOGO_3_PATH}
                            title="Tích hợp mobile"
                            description="iFAWcast cũng có thể cung cấp thông tin đến người dùng thông qua ứng dụng di động"
                        />
                    </div>
                    <div className="af-image">
                        <div className="afi-content">
                            <div
                                className="afi-image"
                                style={{
                                    backgroundImage: `url(${getImageAfSelected()})`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="about-article">
                <div className="aa-container">
                    <div className="aac-title">
                        <h2>Đề tài nghiên cứu</h2>
                        <p>Hệ thống tính toán dự báo và thu thập dữ liệu nghiên cứu sâu keo mùa thu trên cây ngô iFAWcast
                            đã được tích hợp và phát triển cùng với đề tài nghiên cứu này.</p>
                    </div>
                    <div className="aac-content">
                        <div className="aacc-page">
                            <div className="aaccp-image" style={{backgroundImage: `url(${ARTICLE_PAGE_1_IMAGE})`}} />
                        </div>
                        <div className="aacc-summary">
                            <h2>
                                Đề tài: Nghiên cứu phát triển hệ thống tính toán dự báo và thu thập dữ liệu nghiên cứu sâu keo mùa thu trên cây ngô {'('}
                                <a
                                    href="https://b.vjst.vn/index.php/ban_b/article/view/2708/1470"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Article
                                </a>{')'}
                            </h2>
                            <p><span >Tóm tắt: </span>
                            Trong những năm gần đây, việc trồng ngô trên toàn thế giới gặp thách thức lớn bởi sự gia tăng nhanh chóng của sâu keo mùa thu (Spodoptera frugiperda, tên tiếng Anh là Fall armyworm - FAW). Để duy trì mật độ ấu trùng dưới ngưỡng thiệt hại kinh tế, chúng ta cần có các giải pháp liên ngành kịp thời hỗ trợ nông nghiệp như sử dụng dịch tễ học bảo vệ thực vật, internet vạn vật và các phương pháp khoa học dữ liệu thực hiện phát hiện sớm, theo dõi, dự báo và đưa ra các lựa chọn thông minh. Việc lên kế hoạch phòng trừ đúng thời điểm sẽ tránh phun thuốc trừ sâu bừa bãi, gây lãng phí và ảnh hưởng đến môi trường xung quanh. Trong nghiên cứu này, các tác giả đề xuất phát triển hệ thống phần mềm iFAWcast xây dựng trên nền tảng web và mobile, tự động dự báo, cảnh báo và thu thập dữ liệu nghiên cứu FAW trên cây ngô ở Việt Nam. Hệ thống có 3 thành phần chính: (i) Công cụ dự báo, cảnh báo dịch FAW tự động trên nền tảng web; (ii) Công cụ quản lý báo cáo nông nghiệp, dự báo, cảnh báo và người dùng trên nền tảng web; (iii) Ứng dụng trên nền tảng mobile cung cấp dịch vụ theo dõi dự báo, cảnh báo dịch FAW đến người nông dân tùy vị trí địa lý. Hệ thống iFAWcast có lõi tính toán tự động cập nhật dự báo thời tiết từ API Visual Crossing, API OpenWeatherMap và dựa trên công thức tổng tích ôn hữu hiệu xây dựng riêng cho FAW trên cây ngô ở Việt Nam. Hệ thống được phát triển và thử nghiệm dựa trên dữ liệu thu thập trực tiếp từ đồng ruộng để kiểm chứng đã cho kết quả với độ chính xác cao, đáng tin cậy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="about-participants">
                <div className="ap-title">
                    <h2>Thành viên tham gia</h2>
                    <p>Các thành viên tham gia đề tài nghiên cứu phát triển hệ thống tính toán dự báo
                        và thu thập dữ liệu nghiên cứu sâu keo mùa thu trên cây ngô iFAWcast.</p>
                </div>
                <div className="ap-content">
                    {authors.map((author, index) => (
                        <div key={index} className="ap-author">
                            <p>{author.organization}</p>
                            <div className="apa-name">
                                <div className="appa-image" style={{backgroundImage: `url(${USER_AVATAR_IMAGE})`}}/>
                                <div className="apaa">{author.name}</div>
                                <div className="appa-image" style={{backgroundImage: `url(${author.org_logo})`}}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="about-footer">
                <div className="af-copyright">
                    <div className="afc-copyright">
                        <div style={{fontSize:15}}>Privacy Policy • Terms of Service</div>
                        <div>Liên hệ: diepht@vnu.edu.vn</div>
                        <div>Copyright &copy; VNU-UET-iFAWcast Team</div>
                    </div>
                    <div className="afc-logo">
                        <div className="afcl-image" style={{ backgroundImage: `url(${UET_LOGO_IMAGE})` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

type AFFChildProps = {
    isOn: boolean;
    onClick: () => void;
    logoPath: any;
    title: string;
    description: string;
}

const AFFChild: React.FC<AFFChildProps> = (props) => {
    return (
        <button
            className="aff-child"
            onClick={props.onClick}
            style={props.isOn ? { 
                backgroundColor: "rgba(39, 174, 96, 0.2)",
                borderColor: "#9cfca9"
            } : {}}
        >   
            <div className="affc-logo">
                <svg
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                >
                    {props.logoPath}
                </svg>
            </div>
            <div className="affc-content">
                <p><span>{props.title}</span></p>
                <p>{props.description}</p>
                <a>
                    <span>Learn more</span>
                    <svg
                        focusable="false"
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                    >
                        {LEARN_MORE_SVG_PATH}
                    </svg>
                </a>
            </div>
        </button>
    )
}
  