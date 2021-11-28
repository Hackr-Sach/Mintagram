import { Container } from "react-bootstrap";

export const MainNoticeAlert = () => {

    return(
        <div 
          id="MainNoticeAlert" 
          class="MainNoticeAlert flex items-center justify-center pa4 bg-lightest-blue navy">
          <svg 
            class="w1" data-
            icon="info" 
            viewBox="0 0 32 32" 
            style="fill:currentcolor">
            <title>info icon</title>
            <path d="M16 0 A16 16 0 0 1 16 32 A16 16 0 0 1 16 0 M19 15 L13 15 L13 26 L19 26 z M16 6 A3 3 0 0 0 16 12 A3 3 0 0 0 16 6"></path>
          </svg>
          <span class="lh-title ml3">You will be automatically entered into the monthly draw every 3 mints!!!</span>
        </div>
    );
}