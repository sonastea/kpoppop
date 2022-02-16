import { act, render, screen, waitFor } from 'utils/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import * as api from '../MemeAPI';
import Post from '../Post';

const memes = {
  author: { username: 'quora' },
  active: true,
  authorId: 420,
  id: 80085,
  title: 'What is a Korean heart?',
  url: 'https://qph.fs.quoracdn.net/main-qimg-f2c83425896aa46196fb90a361b95b5f-pjlq',
};

const titleURL = 'What_is_a_Korean_heart?';

describe('`Post` component', () => {
  beforeEach(() => {
    act(() => {
      jest.spyOn(api, 'fetchMeme').mockResolvedValue(memes);
      jest.spyOn(api, 'fetchMemeTotalLikes').mockResolvedValue(1);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Find contents of the post, like and unlike the post', async () => {
    render(
      <>
        <MemoryRouter initialEntries={[`/meme/${memes.id}/${titleURL}`]}>
          <Routes>
            <Route path={`/meme/:memeid/:title`} element={<Post />} />
          </Routes>
        </MemoryRouter>
      </>,
      {}
    );

    jest.spyOn(api, 'fetchMeme').mockResolvedValue(memes);

    await waitFor(async () => {
      expect(await screen.findByRole('img')).toBeTruthy();
      expect(await screen.findByText('1')).toHaveTextContent('1');
      expect(await screen.findByText(memes.title)).toHaveTextContent(memes.title);
      expect(await screen.findByText(memes.author.username)).toHaveTextContent(memes.author.username);
    });

    const spyLikeMeme = jest.spyOn(api, 'likeMeme').mockResolvedValue(true);
    const spyUnlikeMeme = jest.spyOn(api, 'unlikeMeme').mockResolvedValue(true);
    const button = await screen.findByRole('button', { name: 'like' });

    userEvent.click(button);
    jest.spyOn(api, 'fetchMemeTotalLikes').mockResolvedValue(2);

    expect(await screen.findByText('2')).toHaveTextContent('2');
    expect(spyLikeMeme).toHaveBeenCalledTimes(1);

    userEvent.click(button);
    jest.spyOn(api, 'fetchMemeTotalLikes').mockResolvedValue(1);

    expect(await screen.findByText('1')).toHaveTextContent('1');
    expect(spyUnlikeMeme).toHaveBeenCalledTimes(1);
  });
});
