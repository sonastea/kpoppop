import { render, screen } from 'utils/test-utils';
import NavBar from 'components/NavBar';
import '@testing-library/jest-dom';
import * as api from '../MemeAPI';
import Memes from '../Memes';
import { act } from 'react-dom/test-utils';
import Like from '../Like';
import userEvent from '@testing-library/user-event';

const memes = [
  {
    author: { username: 'quora' },
    active: true,
    authorId: 420,
    id: 80085,
    title: 'What is a Korean heart?',
    url: 'https://qph.fs.quoracdn.net/main-qimg-f2c83425896aa46196fb90a361b95b5f-pjlq',
  },
  {
    author: { username: 'korra' },
    active: true,
    authorId: 421,
    id: 80086,
    title: 'Test a korean heart.',
    url: 'https://qph.fs.quoracdn.net/main-qimg-f2c83425896aa46196fb90a361b95b5f-pjlq',
  },
];

describe('MemePage `Memes` component', () => {
  beforeEach(() => {
    act(() => {
      jest.spyOn(api, 'fetchMemes').mockResolvedValue(memes);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Load 2 memes and find the author and title of each post', async () => {
    render(
      <>
        <NavBar />
        <Memes />
      </>,
      {}
    );
    expect(await screen.findByText(memes[0].title)).toHaveTextContent(memes[0].title);
    expect(await screen.findByText(memes[0].author.username)).toHaveTextContent(memes[0].author.username);
    expect(await screen.findByText(memes[1].title)).toHaveTextContent(memes[1].title);
    expect(await screen.findByText(memes[1].author.username)).toHaveTextContent(memes[1].author.username);
  });
});

describe('MemePage `Like` component', () => {
  beforeEach(() => {
    act(() => {
      jest.spyOn(api, 'fetchMemeTotalLikes').mockResolvedValue(1);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Get initial total likes, like post, unlike post', async () => {
    render(
      <>
        <Like memeId={memes[0].id} />
      </>,
      {}
    );

    expect(await screen.findByText('1')).toHaveTextContent('1');

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
