import styled from "styled-components";
import { Link } from "react-router-dom";

export const FooterContainer = styled.footer`
  background-color: #3f3e58;
`;
export const FooterWrap = styled.div`
  color: white;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
  font-size: 28px;
`;

export const TeamMeet = styled.div`
  margin-bottom: 100px;
  padding-top: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1400px;
  margin: 0 auto;
`;

export const FooterLinksContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;

  @media screen and (max-width: 820px) {
    padding-top: 32px;
  }
`;

export const FooterLinksWrapper = styled.div`
  display: flex;

  @media screen and (max-width: 1350px) {
    flex-direction: column;
  }
`;

export const FooterLinkItems = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: flex;
  margin: 16px;
  width: 160px;
  box-sizing: border-box;
  color: white;

  @media screen and (max-width: 820px) {
    flex-direction: column;
  }

  @media screen and (max-width: 420px) {
    margin: 0;
    padding: 10px;
    width: 100%;
  }
`;

export const FooterLinkTitle = styled.h1`
  font-size: 14px;
  margin-bottom: 16px;
`;

export const FooterLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin-bottom: 0.5rem;
  font-size: 14px;
  margin-bottom: 3px;

  &:hover {
    color: #feb054;
    transition: 0.3s ease-out;
  }
`;

export const SocialMedia = styled.section`
  max-width: 1000px;
  width: 100%;
`;
export const SocialMediaWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1100px;
  margin-top: 40px;
  font-size: 14px;

  @media screen and (max-width: 820px) {
    flex-direction: column;
  }
`;

export const SocialLogo = styled(Link)`
  font-family: lemon-jelly;
  color: white;
  justify-self: start;
  cursor: pointer;
  text-decoration: none;
  font-size: 2rem;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-weight: bold;

  &:hover {
    color: #feb054;
    transition: 0.3s ease-out;
  }
`;

export const WebsiteRights = styled.small`
  color: white;
  margin-left: 75px;
  margin-bottom: 16px;

  @media screen and (max-width: 820px) {
    margin-left: 0;
  }
`;

export const SocialIcons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
`;

export const SocialIconLink = styled.a`
  color: white;
  font-size: 24px;

  &:hover {
    color: #feb054;
    transition: 0.3s ease-out;
  }
`;
